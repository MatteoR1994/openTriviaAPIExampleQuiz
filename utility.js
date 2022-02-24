/* Randomize array in-place using Durstenfeld shuffle algorithm */
class Utility {
    static shuffleArray(array) {
        const newArray = Array.from(array);
        for (let i = newArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = newArray[i];
            newArray[i] = newArray[j];
            newArray[j] = temp;
        }
        return newArray;
    }
}