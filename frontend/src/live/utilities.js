/** @flow */

var liftP1 = f => (p1        ) => p1.then(a1 =>                             f(a1          ))
var liftP2 = f => (p1, p2    ) => p1.then(a1 => p2.then(a2 =>               f(a1, a2     )))
var liftP3 = f => (p1, p2, p3) => p1.then(a1 => p2.then(a2 => p3.then(a3 => f(a1, a2, a3))))
