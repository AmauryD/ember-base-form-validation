import Component from '@glimmer/component';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { BaseValidator } from './base-validator';
import BaseValidationInputComponent from './base-validation-input';

interface BaseValidationFormArguments {
    schema : BaseValidator,
    validateOnInit : boolean
}

/**
 *
 *
 * @export
 * @class BaseValidationFormComponent
 * @extends {Component}
 */
export default class BaseValidationFormComponent extends Component<BaseValidationFormArguments> {
    @tracked state : {
        children : BaseValidationInputComponent[],
        validationSchema : BaseValidator | undefined
    } = {
        validationSchema : undefined,
        children : []
    };

    /**
     * Update state of component
     */
    updateState() {
        this.state = this.state;
    }

    /**
     *  Check if validator is validating
     */
    get validating() : boolean {
        return (this.state.validationSchema as BaseValidator).validationRunning();
    }

    /**
     * Check if form has errors
     */
    get hasErrors() : boolean {
        return this.errorsArray.length > 0;
    }

    /**
     * 
     */
    get isDirty() : boolean {
        return this.state.children.filter((e) => e.isDirty).length > 0;
    }

    /**
     *
     *
     * @readonly
     * @memberof BaseValidationFormComponent
     */
    get errorsArray() {
        return Object.values((this.state.validationSchema as BaseValidator).errors).filter((v) => v !== null);
    }

    /**
     * Add child to form
     */
    registerChild(child: BaseValidationInputComponent) : void {
        this.state.children.push(child);

        if (this.args.validateOnInit === true) {
            child.validate();
        }
    }

    /**
     * Validates all children
     *
     * @memberof BaseValidationFormComponent
     */
    @action
    validate() : void {
        for (let child of this.state.children) {
            child.validate();
        }
    }

    /**
     *Creates an instance of BaseValidationFormComponent.
     * @memberof BaseValidationFormComponent
     */
    constructor(owner: any,args : BaseValidationFormArguments) {
        super(owner,args);
        this.state.validationSchema = this.args.schema;
    }
}