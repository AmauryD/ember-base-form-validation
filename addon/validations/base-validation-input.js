import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BaseValidationInputComponent extends Component {
    @tracked value;
    @tracked error;
    @tracked parent;
    name;

    constructor() {
        super(...arguments);
        this.value = this.args.value;
        this.name = this.args.validation;
        this.parent = this.args.parent;
        this.parent.registerChild(this);
    }

    @action
    async validate() {
        this.parent.updateState();
        const res = await this.parent.state.validationSchema.validationFor(this.name,this.value);
        this.parent.updateState();
        this.error = res;
    }
}