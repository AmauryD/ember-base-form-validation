import { v1 } from "ember-uuid";

/**
 * Register validation property to class
 *
 * @export
 * @param {*} target
 * @param {*} name
 * @param {*} descriptor
 * @returns
 */


/**
 * Comment
 *
 * @returns {MethodDecorator}
 */
export function ValidationProperty(ignoreUndefined : boolean = true): MethodDecorator {
    return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
        const fn = descriptor.value;
        
        if (descriptor.value.constructor.name === "AsyncFunction") {

            descriptor.value = function (...args : any[]) { 
                const thisContext = this as any;

                if (thisContext.errors[name] === undefined) {
                    thisContext.errors[name] = undefined;
                    thisContext.asyncErrors[name] = {};
                }

                if (ignoreUndefined && args[0] === undefined) {
                    args[0] = "";
                }

                return fn.apply(this, args);
            }
        }else{
            descriptor.value = function (...args : any[]) { 
                const thisContext = this as any;
                
                if (thisContext.errors[name] === undefined) {
                    thisContext.errors[name] = undefined;
                }

                // arg0 is value
                if (ignoreUndefined && args[0] === undefined) {
                    args[0] = "";
                }

                return fn.apply(this, args);
            }
        }   
        
        target.validationProperties[propertyKey] = descriptor;
        return descriptor;
    }
}

/**
 *
 *
 * @export
 * @class BaseValidator
 */
export abstract class BaseValidator {
    /** 
     * @property {object} errors
     * @property {object} asyncErrors
     */
    public errors : {[key : string] : any} = {};
    protected asyncErrors : {[key : string] : any} = {};
    protected context : object | null;
    protected validationProperties : {
        [key : string] : Function
    } = {};

    isDirty(property : string) : boolean {
        return this.errors[property] && this.errors !== undefined;
    }

    /**
     *
     *
     * @returns
     * @memberof BaseValidator
     */
    validationRunning() {
        for (const obj in this.asyncErrors) {
            if (Object.keys(this.asyncErrors[obj]).length > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checkl if current validator has errors
     *
     * @returns {boolean}
     * @memberof BaseValidator
     */
    hasErrors() {
        for (const err in this.errors) 
            if (this.errors[err] !== null) 
                return true;

        return false;
    }

    /**
     * Wait for validation to finish background tasks and then run
     *
     * @returns {boolean}
     * @memberof BaseValidator
     */
    async waitAndCheckErrors() {
        while (this.validationRunning());
        return this.hasErrors();
    }

    /**
     * Some context to pass values like services that cannot be resolved here
     * @param {*} context 
     */
    constructor(context : any = null) {
        this.context = context;
    }

    /**
     * Validate
     */
    validationFor(field : string,value : string,context : any = null) {
        if (this.validationProperties[field]) {
            throw new Error(`'${field}' does not have validation`);
        }

        const validationResult = this.validationProperties[field](value,context);
   
        // handle async validation and assign the result when ready
        if (typeof this.asyncErrors[field] === "object") {
            const asyncId = v1();
            this.asyncErrors[field][asyncId] = {
                promise : validationResult,
                id : asyncId
            };
            return validationResult.then((value:any) => {
                if (value === undefined) {
                    this.errors[field] = null;
                }else{
                    this.errors[field] = value;
                }
                delete this.asyncErrors[field][asyncId];
                return value;
            });
        }

        return this.errors[field] = validationResult === undefined ? null : validationResult;
    }
}

