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
        this.parent.registerChild(this);
    }

    /**
     * Validate value of input
     *
     * @memberof BaseValidationInputComponent
     */
    @action
    async validate() {
        this.parent.updateState();
        const res = await this.parent.state.validationSchema.validationFor(this.name,this.args.value);
        this.parent.updateState();
        this.error = res;
    }
}