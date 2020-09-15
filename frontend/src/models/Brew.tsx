interface Brew {
  timestamp: string;
  comment: string;
}

export function createBrew(comment: string): Brew {
  return {
    timestamp: new Date().toISOString(),
    comment: comment,
  };
}

export default Brew;
