import LayerParam from '@/classes/LayerParam';

export default class LayerSchema implements ICloneable<LayerSchema> {
  constructor(public layerType: string, public layerParams: LayerParam[]) {
  }

  static createDefault() {
    return new LayerSchema("NewLayer", []);
  }

  clone(): LayerSchema {
    return new LayerSchema(this.layerType, this.layerParams.map(x => x.clone()));
  }
}