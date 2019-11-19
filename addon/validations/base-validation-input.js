import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

/**
 *
 *
 * @export
 * @class BaseValidationInputComponent
 * @extends {Component}
 */
export default class BaseValidationInputComponent extends Component {
    /**
     * @property {BaseValidationFormComponent} parent
     * @property {*} error
     * @property {string} name
     * 
     */
    @tracked error;
    @tracked parent;
    @tracked name;

    /**
     * Creates an instance of BaseValidationInputComponent.
     * @memberof BaseValidationInputComponent
     */
    constructor() {
        super(...arguments);
        this.name = this.args.validation;
        this.parent = this.args.parent;

        if (this.args.parent === undefined) {
            if (this.args.alone) return; // if input is alone  ignore

            throw new Error(`Component '${this.name}' needs to have a 'BaseValidationFormComponent' instance as parent , if you want this component without validation and parent use '@alone' as argument to the input. Note that the validate() method will throw an error if called`);
        }

        this.parent.registerChild(this);
    }

    /**
     * Validate value of input
     *
     * @memberof BaseValidationInputComponent
     */
    @action
    async validate() {
        this.parent.updateState(); //parent is required for validation , makes no sense without form , will throw an Error
        const res = await this.parent.state.validationSchema.validationFor(this.name,this.args.value);
        this.parent.updateState(); 
        this.error = res;
    }
}