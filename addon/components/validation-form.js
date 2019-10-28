import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ValidationFormComponent extends Component {
    @tracked state = {
        validationSchema : null,
        childrens : []
    }

    // a bit tricky but that works
    updateState() {
        this.state = this.state;
    }

    /**
     * Check if async validation is running
     */
    get validating() {
        return this.state.validationSchema.validationRunning();
    }

    /**
     * Check if form has errors
     */
    get hasErrors() {
        return this.errorsArray.length > 0;
    }

    /**
     * Returns the errors array of validation Schema
     */
    get errorsArray() {
        return Object.values(this.state.validationSchema.errors).filter((v) => v !== null);
    }

    /**
     * Register child in parent
     * @param {BaseValidationInputComponent} child 
     */
    registerChild(child) {
        this.state.childrens.push(child);
    }

    @action
    validate() {
        for (let child of this.state.childrens) {
            child.validate();
        }
    }

    didInsertElement() {
        if (this.args.validateOnInit) {
            this.validate();
        }
    }

    constructor() {
        super(...arguments);
        this.state.validationSchema = this.args.schema;
    }
}