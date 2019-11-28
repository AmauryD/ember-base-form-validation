import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

/**
 *
 *
 * @export
 * @class BaseValidationFormComponent
 * @extends {Component}
 */
export default class BaseValidationFormComponent extends Component {
    /**
     *
     *
     * @memberof BaseValidationFormComponent
     */
    @tracked state = {
        validationSchema : null,
        childrens : []
    }

    /**
     * Update state of component
     *
     * @memberof BaseValidationFormComponent
     */
    updateState() {
        this.state = this.state;
    }

    /**
     *  Check if validator is validating
     *
     * @readonly
     * @memberof BaseValidationFormComponent
     */
    get validating() {
        return this.state.validationSchema.validationRunning();
    }

    /**
     * Check if form has errors
     *
     * @readonly
     * @memberof BaseValidationFormComponent
     */
    get hasErrors() {
        return this.errorsArray.length > 0;
    }

    /**
     *
     *
     * @readonly
     * @memberof BaseValidationFormComponent
     */
    get errorsArray() {
        return Object.values(this.state.validationSchema.errors).filter((v) => v !== null);
    }

    /**
     * Add child to form
     *
     * @param {BaseValidationInputComponent} child
     * @memberof BaseValidationFormComponent
     */
    registerChild(child) {
        this.state.childrens.push(child);

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
    validate() {
        for (let child of this.state.childrens) {
            child.validate();
        }
    }

    /**
     *Creates an instance of BaseValidationFormComponent.
     * @memberof BaseValidationFormComponent
     */
    constructor() {
        super(...arguments);
        this.state.validationSchema = this.args.schema;
    }
}