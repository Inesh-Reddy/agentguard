import { eventStore } from "@repo/inmemdb";

export class Logger {
  emit(event) {
    eventStore.push(event);
  }

  // print(event) {
  //   console.log(JSON.stringify(event, null, 2));
  // }

  getAll() {
    return eventStore.events;
  }
}
