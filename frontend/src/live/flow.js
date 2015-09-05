/* @flow */


var foo = (x:number) => x * 10
var bar:(x:string,y:number)=>number = (x, y) => x.length * y
var length = (x) => x ? x.length : 0

foo(10)
bar('hello', 42)

length('hello') + length(null)
