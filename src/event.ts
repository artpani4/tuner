class MyEventTarget extends EventTarget {
  constructor() {
    super();
  }

  triggerCustomEvent(eventName: string, eventData: any): void {
    const event = new CustomEvent(eventName, { detail: eventData });
    this.dispatchEvent(event);
  }
}

const myEventTarget = new MyEventTarget();

myEventTarget.addEventListener('myEvent', (event: Event) => {
  const customEvent = event as CustomEvent;
  console.log('Событие myEvent с данными:', customEvent.detail);
});

myEventTarget.triggerCustomEvent('myEvent', {
  message: 'Привет, мир!',
});

// class MyEventTarget extends EventTarget {
//   constructor() {
//     super();
//   }

//   triggerCustomEvent(eventName: string, eventData: any): void {
//     const event = new CustomEvent(eventName, { detail: eventData });
//     this.dispatchEvent(event); // Исправлено на this.dispatchEvent
//   }
// }

// // Пример использования
// const myEventTarget = new MyEventTarget();

// myEventTarget.addEventListener('myEvent', (event: Event) => {
//   const customEvent = event as CustomEvent;
//   console.log('Событие myEvent с данными:', customEvent.detail);
// });

// myEventTarget.triggerCustomEvent('myEvent', {
//   message: 'Привет, мир!',
// });
