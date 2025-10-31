/**
 * Matrix class used here primarily for solving linear systems of equations
 */
class Matrix {
    constructor(entries) {
        this.entries = entries;

        this.rows = entries.length;
        this.cols = entries[0].length;
    }

    multiply(other) {
        if (this.cols !== other.rows) {
            throw Error("Matrix dimensions don't match.")
        }

        let result = [];
        
        for (let i = 0; i < this.rows; i++) {
            result[i] = [];

            for (let j = 0; j < other.cols; j++) {
                let sum = 0;

                for (let k = 0; k < this.cols; k++) {
                    sum += this.entries[i][k] * other.entries[k][j];
                }

                result[i][j] = sum;
            }
        }

        return new Matrix(result);
    }

    rref(verbose = false) {
        let pivot_index = 0;

        for (let i = 0; i < this.rows; i++) {
            if (pivot_index > this.cols - 1) break;

            if (verbose) console.log("Considering ", i, "th row.");
            // Consider ith row

            let pivot = this.entries[i][pivot_index];

            if (pivot === 0) {
                if (verbose) console.log("Pivot is 0, searching for valid row.");
                // If pivot is zero, but it's not the last row -> search for valid pivot and swap the rows

                let valid_row_found = false;

                for (let j = i + 1; j < this.rows; j++) {
                    const leading = this.entries[j][pivot_index];

                    if (leading !== 0) {
                        if (verbose) console.log("\tValid row found, swapping rows");

                        valid_row_found = true;

                        [this.entries[i], this.entries[j]] = [this.entries[j], this.entries[i]]

                        pivot = this.entries[i][pivot_index];

                        break;
                    }
                }

                // If no row is found -> continue with next pivot index, but stay at the same row

                if (!valid_row_found) {
                    if (verbose) console.log("\tValid row not found, proceeding to next pivot index");

                    pivot_index++; i--;

                    continue;
                }
            }

            // Else, if pivot is not zero -> it's all fine, reduce rows below and switch to next pivot index

            // Normalise reducing row
            for (let k = 0; k < this.cols; k++) {
                this.entries[i][k] /= pivot;
            }

            for (let j = 0; j < this.rows; j++) {
                if (i === j) continue;

                if (verbose) console.log("\tReducing ", j, "th row.");
                // Consider jth row below the ith row

                const leading = this.entries[j][pivot_index];

                if (leading === 0) {
                    // If the leading element of jth column is 0 -> the row is already reduced, skip

                    continue;
                }

                // Else if the row isn't reduced -> proceed to reduce it

                for (let k = 0; k < this.cols; k++) {
                    if (verbose) console.log("\t\tReducing ", k, "th element.");
                    // Reduce elements in the jth row

                    this.entries[j][k] -= this.entries[i][k] * leading;
                }
            }

            pivot_index++;
        }
    }

    /**
     * 
     * @returns Column matrix of solutions or null if there is no solution
     */
    solve() {
        if (this.cols - 1 > this.rows) {
            // The system is underdetermined when there are more variables than equations

            return null;
        }

        let is_column_empty = true;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.entries[i][j] !== 0) {
                    is_column_empty = false;

                    break;
                }
            }

            if (!is_column_empty) break;
        }

        if (is_column_empty) return null;


        // Return values in the last column, they are solutions to the system

        let solutions = [];

        for (let i = 0; i < this.rows; i++) {
            solutions.push([this.entries[i][this.cols - 1]])
        }

        return new Matrix(solutions);
    }

    print(float_precision = 2) {
        let longest_number_length = 0;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const number_length = this.entries[i][j].toFixed(float_precision).replace(/\.?0+$/, '').length

                if (number_length > longest_number_length) {
                    longest_number_length = number_length
                }
            }
        }

        let string = "";

        for (let i = 0; i < this.rows; i++) {
            string += "| ";

            for (let j = 0; j < this.cols; j++) {
                string += this.entries[i][j].toFixed(float_precision).replace(/\.?0+$/, '').padEnd(longest_number_length) + " ";
            }

            string += "|\n";
        }

        console.log(string);
    }
}