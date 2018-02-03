
export class Step {
	public start: number;
	public end: number;
	constructor(start: number, end: number) {
		this.start = start;
		this.end = end;
	}
}
export  class Util {
	public static reqAnimF(fn: () => void): number {
		const req = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			function (callback: () => void): number {
				return setTimeout(callback, 1000 / 60)
			}
		return req(fn);
	}
	public static cancel(timerId: number): void {
		const cancelFn = window.cancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			clearTimeout;
		cancelFn(timerId);
	}
	public static createStep(start:number,end:number):Step{
		return new Step(start,end);
	}
	public static Tween:{
		[index:string]
	}={
		linear(currentTime:number,beginVal:number,changeVal:number,duration:number):number{
			return changeVal * currentTime / duration +beginVal;
		}
	}
}