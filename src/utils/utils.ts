export const shuffleArray = (arr : any[] ): any[] => { 
    return arr.map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1])
    };

export const clamp = (min: number, n: number, max: number) => {
      return Math.max(min, Math.min(n, max));
    };

export const sleep = async (waitTime: number) =>
  new Promise(resolve =>
    setTimeout(resolve, waitTime));