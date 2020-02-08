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
export function validationProperty(ignoreUndefined = true) {
    return function(target, name, descriptor) {
        const fn = descriptor.value;
        
        if (descriptor.value.constructor.name === "AsyncFunction") {

            descriptor.value = function (...args) { 
                if (this.errors[name] === undefined) {
                    this.errors[name] = null;
                    this.asyncErrors[name] = {};
                }

                if (ignoreUndefined && args[0] === undefined) {
                    args[0] = "";
                }

                return fn.apply(this, args);
            }
        }else{

            descriptor.value = function (...args) { 
                if (this.errors[name] === undefined) {
                    this.errors[name] = null;
                }

                // arg0 is value
                if (ignoreUndefined && args[0] === undefined) {
                    args[0] = "";
                }

                return fn.apply(this, args);
            }
        }
        
        return descriptor;
    }
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
     * Validate
     *
     * @param {string} field
     * @param {string} value
     * @param {Object} context
     * @returns
     * @memberof BaseValidator
     */
    validationFor(field,value,context = null) {
        if (!this[field]) throw new Error(`'${field}' does not have validation`);
        const validationResult = this[field](value, context);
        
        // handle async validation and assign the result when ready
        if (typeof this.asyncErrors[field] === "object") {
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

