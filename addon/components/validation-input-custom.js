import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ValidationInputCustomComponent extends Component {
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
    validate() {
        const res = this.parent.validationSchema.validationFor(this.name,this.value);
        this.error = res;
    }
}
