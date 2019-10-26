export function validationProperty(target, name, descriptor) {
    const fn = descriptor.value;
    descriptor.value = function(...args){ 
      if (this.errors[name] === undefined) {
        this.errors[name] = null;
      }
      return fn.apply(this, args);
    }
    return descriptor;
}

export class BaseValidator {
    errors = {};

    hasErrors() {
        for (let err in this.errors)
            if (this.errors[err] !== null) return true;

        return false;
    }

    validationFor(field,value) {
        if (!this[field]) throw new Error(`${field} does not have validation`);


        const validationResult = this[field](value);
        
        // handle async validation and assign the result when ready
        if (this[field].constructor.name === "AsyncFunction") {
            return validationResult.then((value) => {
                if (value === undefined) {
                    this.errors[field] = null;
                }else{
                    this.errors[field] = value;
                }
            });
        }

        return this.errors[field] = validationResult === undefined ? null : validationResult;
    }
}