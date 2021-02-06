import { Subject } from 'rxjs/Subject';

export default class AggregatedEventSourceNonEvt extends Subject {
  constructor(url) {
    super();

    this.source = new EventSource(url);
    this.state = {};

    this.source.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      this.state.data = payload;
      this.next(this.collection());
    };
  }

  normalize(item) {
    const it = Object.assign(
      {},
      {
        inventory: {
          quantity: item.availableStock
        }
      },
      item
    );
    return it;
  }

  collection() {
    const coll = {};
    this.state.data.forEach((item) => {
      coll[`0${item.upc}`] = this.normalize(item);
    });
    return coll;
  }
}
