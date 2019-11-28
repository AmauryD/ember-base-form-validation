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
    @tracked name;

    parent;
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

            throw new Error(`Component '${this.constructor.name}' needs to have a 'BaseValidationFormComponent' instance as '@parent' , if you want this component without validation and parent use '@alone={{true}}' as argument to the input. Note that the validate() method will throw an error if called`);
        }else{
            if (this.parent.state.validationSchema === undefined) {
                throw new Error(`Component '${this.constructor.name}' needs to have a 'BaseValidator' instance as '@schema' , if you want this component without validation and parent use '@alone={{true}}' as argument to the input. Note that the validate() method will throw an error if called`);
            }
        }

        if (!this.args.value) {
            console.warn(`Component '${this.constructor.name}' seems to have an undefined @validation attribute`);
        }

        if (!this.args.validation) {
            throw new Error(`Component '${this.constructor.name}' needs to have a '@validation' attribute , if you want this component without validation and parent use '@alone={{true}}' as argument to the input. Note that the validate() method will throw an error if called`);
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