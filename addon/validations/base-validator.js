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
export function validationProperty(target, name, descriptor) {
    const fn = descriptor.value;
    
    
    if (descriptor.value.constructor.name === "AsyncFunction") {
        descriptor.value = async function(...args){ 
            if (this.errors[name] === undefined) {
              this.errors[name] = null;
              this.asyncErrors[name] = {};
            }
            return fn.apply(this, args);
        }
    }else{
        descriptor.value = function(...args){ 
            if (this.errors[name] === undefined) {
              this.errors[name] = null;
            }
            return fn.apply(this, args);
        }
    }
    
    return descriptor;
}

/**
 *
 *
 * @export
 * @class BaseValidator
 */
export class BaseValidator {
    /** 
     * @property {object} errors
     * @property {object} asyncErrors
     */
    errors = {};
    asyncErrors = {};

    /**
     *
     *
     * @returns
     * @memberof BaseValidator
     */
    validationRunning() {
        for (let obj in this.asyncErrors) {
            if (Object.keys(this.asyncErrors[obj]).length > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     *
     * @returns {boolean}
     * @memberof BaseValidator
     */
    hasErrors() {
        for (let err in this.errors) 
            if (this.errors[err] !== null) 
                return true;

        return false;
    }

    /**
     * wait for validation to finish background tasks and then run
     */
    async waitAndCheckErrors() {
        while (this.validationRunning());
        return this.hasErrors();
    }

    /**
     * Validate
     *
     * @param {string} field
     * @param {string} value
     * @returns
     * @memberof BaseValidator
     */
    validationFor(field,value) {
        if (!this[field]) throw new Error(`'${field}' does not have validation`);
        const validationResult = this[field](value);
        
        // handle async validation and assign the result when ready
        if (this[field].constructor.name === "AsyncFunction") {
            const asyncId = v1();
            this.asyncErrors[field][asyncId] = {
                promise : validationResult,
                id : asyncId
            };
            return validationResult.then((value) => {
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