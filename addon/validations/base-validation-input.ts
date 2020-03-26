import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { ConfigurationException } from "../errors/configurationException";
import BaseValidationFormComponent from './base-validation-form';
import { BaseValidator } from 'ember-base-form-validation';

interface BaseValidationInputArgs {
    validation: string,
    parent: BaseValidationFormComponent,
    alone: boolean,
    value?: any
    selected?: any
}

/**
 *
 *
 * @export
 * @class BaseValidationInputComponent
 * @extends {Component}
 */
export default class BaseValidationInputComponent extends Component<BaseValidationInputArgs> {
    @tracked error : any;
    @tracked name : string;
    parent : BaseValidationFormComponent;
    
    /**
     * Creates an instance of BaseValidationInputComponent.
     */
    constructor(owner: unknown,args: BaseValidationInputArgs) {
        super(owner,args);
        this.name = this.args.validation;
        this.parent = this.args.parent;

        if (this.args.parent === undefined) {
            if (this.args.alone) return; // if input is alone  ignore

            throw new ConfigurationException(`Component '${this.constructor.name}' needs to have a 'BaseValidationFormComponent' instance as '@parent' , if you want this component without validation and parent use '@alone={{true}}' as argument to the input. Note that the validate() method will throw an error if called`);
        }else{
            if (this.parent.state.validationSchema === undefined) {
                throw new ConfigurationException(`Component '${this.constructor.name}' needs to have a 'BaseValidator' instance as '@schema' , if you want this component without validation and parent use '@alone={{true}}' as argument to the input. Note that the validate() method will throw an error if called`);
            }
        }

        if (!this.args.value && !this.args.selected) {
            // eslint-disable-next-line no-console
            console.warn(`Component '${this.constructor.name}' seems to have an undefined @validation attribute`);
        }

        if (!this.args.validation) {
            throw new ConfigurationException(`Component '${this.constructor.name}' needs to have a '@validation' attribute , if you want this component without validation and parent use '@alone={{true}}' as argument to the input. Note that the validate() method will throw an error if called`);
        }

        this.parent.registerChild(this);
    }

    get isDirty(): boolean {
        return (this.parent.state.validationSchema as BaseValidator).isDirty(this.name);
    }

    /**
     * Validate child value and update parent
     */
    @action
    async validate(): Promise<void> {
        if (this.args.parent === undefined) {
            if (this.args.alone) return; // if input is alone  ignore
        }

        let value = this.args.value || this.args.selected;
        const res = await (this.parent.state.validationSchema as BaseValidator).validationFor(this.name,value,this);
        this.parent.updateState(); 
        this.error = res;
    }
}