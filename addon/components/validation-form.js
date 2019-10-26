import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ValidationFormComponent extends Component {
    @tracked validationSchema;
    @tracked childrens = [];

    get errorsArray() {
        return Object.values(this.validationSchema.errors);
    }

    registerChild(child) {
        this.childrens.push(child);
    }

    @action
    validateAll() {
        for (let child of this.childrens) {
            child.validate();
        }
    }

    constructor() {
        super(...arguments);
        this.validationSchema = this.args.schema;
    }
}