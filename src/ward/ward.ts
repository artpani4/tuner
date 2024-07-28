// import { InvalidPeriodFormat, NonComparableItems } from './errors.ts';
// import { eventEmitter } from './eventManager.ts';
// type TargetType =
//   | 'localFile'
//   | 'remoteFile'
//   | 'variable'
//   | 'remoteData';

// // const reg = new FinalizationRegistry((id: number) => {
// //   console.log(`Вард ${id} был уничтожен!`);
// // });

// type remoteCb<T> = () => Promise<T>;
// export interface WardEventData<T> {
//   old: object | string | T;
//   new: object | string | T;
//   timeOfLastChange: number;
// }

// export class Ward<T extends Object = {}> {
//   static wards: Ward<any>[] = [];

//   static stopAllWards: () => void = () => {
//     Ward.wards.forEach((ward) => ward.stop());
//     Ward.wards = [];
//   };
//   private title = '';
//   private period = 500;
//   private timeoutId = 0;
//   private localPath = '';
//   private lastChangeDetectedTimestamp = 0;
//   private typeData: TargetType = 'variable';
//   private conditionToStop: (
//     data: WardEventData<T>,
//   ) => boolean = () => false;

//   private lastMemo: T | string | null = null;
//   private dataCb: remoteCb<T> | null = null;

//   private handler: (
//     oldValue: T | string,
//     newValue: T | string,
//   ) => void = () => {};

//   public event = '';

//   // private watchedObjectRef: WeakRef<T> | null = null;

//   name(title: string) {
//     this.title = title;
//     return this;
//   }

//   public target = {
//     file: {
//       local: (path: string) => {
//         this.localPath = path;
//         this.typeData = 'localFile';
//         return this;
//       },
//     },
//     data: {
//       remote: (cb: () => Promise<T>) => {
//         this.dataCb = cb;
//         this.typeData = 'remoteData';
//         return this;
//       },
//     },
//   };

//   time(period: number) {
//     this.period = period;
//     return this;
//   }

//   public build() {
//     Ward.wards.push(this);

//     return this;
//   }

//   public ifChangedThen = {
//     runCallback: (
//       callback: (oldValue: T | string, newValue: T | string) => void,
//     ) => {
//       this.handler = callback;
//       return this;
//     },
//     emitEvent: (eventName: string) => {
//       this.event = eventName;
//       this.handler = (oldValue: T | string, newValue: T | string) => {
//         eventEmitter.emit(eventName, {
//           old: oldValue,
//           new: newValue,
//           timeOfLastChange: this.lastChangeDetectedTimestamp,
//         });
//       };
//       return this;
//     },
//   };

//   public stopIf = {
//     condition: (
//       predicate: (
//         data: WardEventData<T>,
//       ) => boolean,
//     ) => {
//       this.conditionToStop = predicate;
//       return this;
//     },
//     eventTriggered: (eventName: string) => {
//       eventEmitter.on(
//         eventName,
//         (_data?: WardEventData<T>) => {
//           this.stop();
//         },
//       );
//       return this;
//     },
//   };

//   async grab() {
//     switch (this.typeData) {
//       case 'remoteData':
//         return await this.dataCb!();
//       case 'localFile':
//         return await Deno.readTextFile(this.localPath);
//       // case 'variable':
//       //   return this.watchedObjectRef?.deref() as T;
//       default:
//         return {} as T;
//     }
//   }

//   deepCopy(obj: any): any {
//     if (typeof obj !== 'object' || obj === null) {
//       return obj;
//     }

//     if (obj instanceof Date) {
//       return new Date(obj);
//     }

//     if (obj instanceof Array) {
//       const copy = [];
//       for (const item of obj) {
//         copy.push(this.deepCopy(item));
//       }

//       return copy;
//     }

//     if (obj instanceof Object) {
//       const copy: Record<string, any> = {};
//       for (const key in obj) {
//         if (obj.hasOwnProperty(key)) {
//           copy[key] = this.deepCopy(obj[key]);
//         }
//       }
//       return copy;
//     }

//     throw new Error('Unable to copy object.');
//   }

//   deepEqual(obj1: any, obj2: any): boolean {
//     if (obj1 === obj2) {
//       return true;
//     }

//     if (
//       typeof obj1 !== 'object' || typeof obj2 !== 'object' ||
//       obj1 === null || obj2 === null
//     ) {
//       return false;
//     }

//     if (Object.keys(obj1).length !== Object.keys(obj2).length) {
//       return false;
//     }

//     const areFunctions = (x: any, y: any) =>
//       typeof x === 'function' && typeof y === 'function' &&
//       x.toString() === y.toString();

//     for (const key in obj1) {
//       if (!obj2.hasOwnProperty(key)) {
//         return false;
//       }

//       const val1 = obj1[key];
//       const val2 = obj2[key];

//       if (!areFunctions(val1, val2) && !this.deepEqual(val1, val2)) {
//         return false;
//       }
//     }

//     return true;
//   }

//   equal(a: object | string, b: object | string): boolean {
//     if (typeof a == 'object' && typeof b == 'object') {
//       return this.deepEqual(a, b);
//     }
//     if (typeof a == 'string' && typeof b == 'string') {
//       return a == b;
//     }
//     throw new NonComparableItems(a, b);
//   }

//   copy(target: object | string): object | string {
//     return typeof target == 'object' ? this.deepCopy(target) : target;
//   }

//   async start() {
//     if (this.lastMemo === null) {
//       this.lastMemo = await this.grab();
//     }
//     const milliseconds = this.period;
//     this.timeoutId = setInterval(async () => {
//       // console.log(eventEmitter.listeners('CONFIG_CHANGE'));
//       // console.log(Ward.wards.length);
//       const newData = await this.grab();

//       if (
//         this.conditionToStop({
//           old: this.lastMemo!,
//           new: this.deepCopy(newData),
//           timeOfLastChange: this.lastChangeDetectedTimestamp,
//         })
//       ) {
//         this.stop();
//         return;
//       }
//       // console.log(newData, this.lastMemo);
//       // console.log(this.equal(newData, this.lastMemo!));
//       if (!this.equal(newData, this.lastMemo!)) {
//         this.handler(this.lastMemo!, newData);
//         this.lastMemo = this.copy(newData) as typeof newData;
//         this.lastChangeDetectedTimestamp = Date.now();
//       }
//     }, milliseconds);
//     // console.log(`${this.timeoutId} created`);
//     // reg.register(this, this.timeoutId);
//   }

//   stop() {
//     console.log(`Ward ${this.title} stopped`);
//     clearInterval(this.timeoutId);
//   }

//   // private parseMilliseconds() {
//   //   const stringTimes = this.period.split('/');
//   //   if (stringTimes.length !== 3) {
//   //     throw new InvalidPeriodFormat();
//   //   }
//   //   const [minutes, seconds, milliseconds] = stringTimes
//   //     .map((part) => part === '*' ? 0 : parseInt(part, 10));
//   //   if (milliseconds == 0 && minutes == 0 && seconds == 0) {
//   //     return 5000;
//   //   }
//   //   const totalMilliseconds = (minutes * 60 * 1000) +
//   //     (seconds * 1000) + milliseconds;
//   //   return totalMilliseconds;
//   // }
// }
