

class PVCSolver {

    private readonly nbVertex: number;
    private readonly adjMatrix: number[][];

    constructor({
        nbVertex,
    }: {
        nbVertex: number,
    }) {
        this.nbVertex = nbVertex;
        this.adjMatrix = Array.from({ length: nbVertex }, () => 
            Array.from({ length: nbVertex }, () => 1)
        );

        // Set diagonal to 0 as there are no self-loops in a complete graph
        for (let i = 0; i < nbVertex; i++) {
            this.adjMatrix[i][i] = 0;
        }

    }


    setEdgeWeight({
        i,
        j,
        weight,
    }: {
        i: number,
        j: number,
        weight: number,
    }) {
        this.adjMatrix[i][j] = weight;
        this.adjMatrix[j][i] = weight;
    }


    solveExact(): {
        minCost: number,
        minCostPath: number[],
        excutionTime: number,
    } {
        
const start = performance.now(); // Start time
        const startingVertex = 0;

        const stack: {
            vertex: number,
            visited: number[],
            cost: number,
        }[] = [];
        
        let minCost = Infinity;
        let minCostPath: number[] = [];

        stack.push({
            vertex: startingVertex,
            visited: [startingVertex],
            cost: 0,
        });

        while (stack.length > 0) {
            const { vertex, visited, cost } = stack.pop()!;

            if (visited.length === this.nbVertex) {


                if ( cost + this.adjMatrix[vertex][startingVertex]  < minCost) {
                    minCost = cost + this.adjMatrix[vertex][startingVertex];
                    minCostPath = [...visited, startingVertex];
                }
                continue;
            }

            for (let i = 0; i < this.nbVertex; i++) {
                if (visited.includes(i)) {
                    continue;
                }

                stack.push({
                    vertex: i,
                    visited: [...visited, i],
                    cost: cost + this.adjMatrix[vertex][i],
                });
            }
        }
        
        const end = performance.now(); // End time
        return {
            minCost,
            minCostPath,
            excutionTime: end - start,
        };

    }


    solveHeuristic(): {
        minCost: number,
        minCostPath: any[],
        excutionTime: number,
    } {

        const start = performance.now(); // Start time
        
        const orderedArcs: {
            i: number,
            j: number,
            weight: number,
        }[] = [];

        for (let i = 0; i < this.nbVertex; i++) {
            for (let j = i + 1; j < this.nbVertex; j++) {
                if (i === j) {
                    continue;
                }
                orderedArcs.push({
                    i,
                    j,
                    weight: this.adjMatrix[i][j],
                });
            }
        }
        orderedArcs.sort((a, b) => a.weight - b.weight);

        const minCostPath: {
            i: number,
            j: number,
            weight: number,
        }[] = [];
        let minCost = 0;

        const degrees: Map<number, number> = new Map();

        for (let i = 0; i < this.nbVertex; i++) {
            degrees.set(i, 0);
        }


        for (const arc of orderedArcs) {
            if (degrees.get(arc.i) === 2 || degrees.get(arc.j) === 2) {
                continue;
            }

            const foundi = minCostPath.find((vertex) => vertex.i === arc.i || vertex.j === arc.i);
            const foundj = minCostPath.find((vertex) => vertex.j === arc.j || vertex.j === arc.j);
            if (minCostPath.length !== this.nbVertex-1 && foundi && foundj) {
                continue;
            }

            minCost += arc.weight;

            minCostPath.push(arc);


            degrees.set(arc.i, degrees.get(arc.i)! + 1);
            degrees.set(arc.j, degrees.get(arc.j)! + 1);
        }

        const end = performance.now(); // End time

        return {
            minCost,
            minCostPath,
            excutionTime: end - start,
        };



    }

}



const test = () => {

    const solver = new PVCSolver({
        nbVertex: 4,
    });

    solver.setEdgeWeight({
        i: 0,
        j: 1,
        weight: 10,
    });

    solver.setEdgeWeight({
        i: 1,
        j: 2,
        weight: 15,
    });

    solver.setEdgeWeight({
        i: 2,
        j: 3,
        weight: 20,
    });

    solver.setEdgeWeight({
        i: 3,
        j: 0,
        weight: 25,
    });

    solver.setEdgeWeight({
        i: 0,
        j: 2,
        weight: 40, // change it to 5 to see the difference between exact and heuristic
    });

    const { minCost, minCostPath, excutionTime} = solver.solveExact();

    console.log(minCost, minCostPath, excutionTime);

    const { minCost: minCost2, minCostPath: minCostPath2, excutionTime: excutionTime2 } = solver.solveHeuristic();

    console.log(minCost2, minCostPath2, excutionTime2);

}


test();

export default PVCSolver;