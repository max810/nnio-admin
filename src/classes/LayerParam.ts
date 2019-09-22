import {Dictionary} from 'vue-router/types/router';
import {JSONTypes} from '@/constants';
import NamelessLayerParamValue from '@/classes/NamelessLayerParamValue';

export default class LayerParam implements ICloneable<LayerParam> {
  public isOneOf: boolean;
  public additionalConstraints: Dictionary<any>; // basically a copy
  public oneOfs: Dictionary<NamelessLayerParamValue[] | NamelessLayerParamValue[][]>;

  public get activeOneOfs(): NamelessLayerParamValue[] | NamelessLayerParamValue[][] {
    return this.oneOfs[this.type];
  }

  public get activeConstraints(): LayerParam[] | any {
    if (this.type === 'array' && this.additionalConstraints['array'].itemsConstraints === null) {
      this.additionalConstraints['array'].itemsConstraints = new LayerParam("itemsConstraints", "number", false);
    }

    return this.additionalConstraints[this.type];
  }

  constructor(public name: string,
              public type: string,
              public required: boolean,
              constraints: Dictionary<LayerParam[] | any> = {},
              oneOfs: any[] = []) {
    this.oneOfs = {};
    for (const k of JSONTypes) {
      this.oneOfs[k] = [];
    }
    this.oneOfs[type] = oneOfs || [];
    this.additionalConstraints = LayerParam.getDefaultConstraints();
    this.additionalConstraints[type] = constraints || LayerParam.getDefaultConstraints()[type];
    this.isOneOf = (oneOfs && oneOfs.length > 0);
  }

  static createDefault() {
    return new LayerParam("", "string", false);
  }

  static getDefaultConstraints(): Dictionary<object> {
    return {
      number:
        {
          maximum: null,
          minimum: null,
        },
      integer:
        {
          maximum: null,
          minimum: null,
        },
      array:
        {
          minItems: null,
          maxItems: null,
          itemsConstraints: null
        },
      boolean: {},
      string: {},
      object: [],
    };
  }

  clone(): LayerParam {
    let constraints: any = {};
    switch (this.type) {
      case "object":
        constraints = this.additionalConstraints['object'].map((x: LayerParam) => x.clone());
        break;
      case "array":
        const arrayConstraints: any = {};
        for (const [k, v] of Object.entries(this.additionalConstraints['array'])) {
          if (k !== 'itemsConstraints') {
            arrayConstraints[k] = JSON.parse(JSON.stringify(v));
          }
          arrayConstraints['itemsConstraints'] =
            this.additionalConstraints['array']['itemsConstraints'] == null
              ? null
              : (<LayerParam>this.additionalConstraints['array']['itemsConstraints']).clone();
        }
        constraints = arrayConstraints;
        break;
      default:
        constraints = JSON.parse(JSON.stringify(this.activeConstraints));
        break;
    }

    const oneOfsOrig = this.oneOfs[this.type];
    let oneOfs: any = [];
    if (oneOfsOrig.length && oneOfsOrig[0] instanceof NamelessLayerParamValue) {
      oneOfs = (<NamelessLayerParamValue[]>oneOfsOrig).map(x => x.clone());
    } else if (!oneOfsOrig.length) {
      oneOfs = [];
    } else {
      (<NamelessLayerParamValue[][]>oneOfsOrig).map(x => x.map(y => y.clone()));
    }
    // const constraints = Object.fromEntries(Object.entries(this.additionalConstraints).map(([k, v]) => [k, v.clone()]));
    return new LayerParam(this.name, this.type, this.required, constraints, oneOfs);
  }
}
