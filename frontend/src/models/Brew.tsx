interface Brew {
  timestamp: string;
  bean: string | null;
  beanWeightInGrams: number | null;
  grinder: string | null;
  grindSetting: number | null;
  bloomTimeInSeconds: number | null;
  brewTimeInSeconds: number | null;
  waterWeightInGrams: number | null;
  comment: string | null;
}

export class BrewBuilder {
  timestamp: string;
  bean: string | null = null;
  beanWeightInGrams: number | null = null;
  grinder: string | null = null;
  grindSetting: number | null = null;
  bloomTimeInSeconds: number | null = null;
  brewTimeInSeconds: number | null = null;
  waterWeightInGrams: number | null = null;
  comment: string | null = null;

  constructor(timestamp?: string) {
    this.timestamp =
      timestamp === undefined ? new Date().toISOString() : timestamp;
  }

  withBean(bean: string | null) {
    this.bean = bean;
    return this;
  }

  withBeanWeightInGrams(beanWeightInGrams: number | string | null) {
    this.beanWeightInGrams = this._parseNumberOrNull(beanWeightInGrams);
    return this;
  }

  withGrinder(grinder: string | null) {
    this.grinder = grinder;
    return this;
  }

  withGrindSetting(grindSetting: number | string | null) {
    this.grindSetting = this._parseNumberOrNull(grindSetting);
    return this;
  }

  withBloomTimeInSeconds(bloomTimeInSeconds: number | string | null) {
    this.bloomTimeInSeconds = this._parseNumberOrNull(bloomTimeInSeconds);
    return this;
  }

  withBrewTimeInSeconds(brewTimeInSeconds: number | string | null) {
    this.brewTimeInSeconds = this._parseNumberOrNull(brewTimeInSeconds);
    return this;
  }

  withWaterWeightInGrams(waterWeightInGrams: number | string | null) {
    this.waterWeightInGrams = this._parseNumberOrNull(waterWeightInGrams);
    return this;
  }

  withComment(comment: string | null) {
    this.comment = comment;
    return this;
  }

  build(): Brew {
    return {
      timestamp: this.timestamp,
      bean: this.bean,
      beanWeightInGrams: this.beanWeightInGrams,
      grinder: this.grinder,
      grindSetting: this.grindSetting,
      bloomTimeInSeconds: this.bloomTimeInSeconds,
      brewTimeInSeconds: this.brewTimeInSeconds,
      waterWeightInGrams: this.waterWeightInGrams,
      comment: this.comment,
    };
  }

  _parseNumberOrNull(value: number | string | null) {
    if (typeof value === "string") {
      return parseFloat(value);
    }
    return value;
  }
}

export default Brew;
