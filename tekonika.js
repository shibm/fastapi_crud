// console.log('1');
// setTimeout(() => console.log('2'), 0);
// setImmediate(() => console.log('3'));
// process.nextTick(() => console.log('4'));
// Promise.resolve().then(() => console.log('5'));
// console.log('6');



// const arr = [1, 2, 6, 4, 6, 3, 4, 2, 1]
// let final = []
// for ( let i = 0; i < arr.length ; i++) {
//     for (let j = i+1; j < arr.length; j++) {
//         // to get duplicates
//         if(arr[i] === arr[j]){
//             // console.log(arr[i])
//             final.push(arr[i])
//             break
//         }
//         }
//     }
//     console.log(final)

// to get the unique one

// const arr = [1, 2, 6, 4, 6, 3, 4, 2, 1];
// let final = [];

// for (let i = 0; i < arr.length; i++) {
//     let count = 0;

//     for (let j = 0; j < arr.length; j++) {
//         if (arr[i] === arr[j]) {
//             count++;
//         }
//     }

//     if (count === 1) {
//         final.push(arr[i]);
//     }
// }

// console.log(final);

// Understand just two things:
// 1. count++ counts how many times a number appears.
// 2. count === 1 means the number appears exactly once.
// For example:
// - 1 appears 2 times.
// - 2 appears 2 times.
// - 4 appears 2 times.
// - 6 appears 2 times.
// - 3 appears 1 time.
// Therefore, the answer is [3].


var twoSum = function(nums, target) {
    console.log(nums)
    var sum = 0
    for (i=0; i < nums.length; i++){
        console.log(nums[i])
        for (j = i + 1; j < nums.length; j++){
            if ( nums[i] + nums[j] === target){
                console.log(target)
                sum++
                return [i, j]
            }
        }
        
    }
    return []
};
const sums = [3,4],
target = 7
console.log(twoSum(sums, target))