import React from "react";

const Test = () => {
  const createWorker = () => {
    const worker = new Worker(
      new URL("../test-worker/test.worker.js", import.meta.url)
    );
    worker.onmessage = (event) => {
      const msg = event.data;
      console.log(`1 worker.onmessage: ${msg}`);
      worker.terminate();
      console.log(`1 worker finished.`);
    };

    const msg = "Hello world";
    console.log(`1 worker.postMessage: ${msg}`);
    worker.postMessage(msg);
  };
  const compileWithWorker = async (data) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL("../test-worker/solc.worker.js", import.meta.url)
      );
      worker.postMessage(data);
      worker.onmessage = function (event) {
        resolve(event.data);
      };
      worker.onerror = reject;
    });
  };
  const handleCompile = async () => {
    const result = await compileWithWorker({
      content: "",
    });
    console.log(result);
  };
  return (
    <div>
      <h2>Test - work Loader</h2>
      <button onClick={createWorker}>createWorker</button>
      <button onClick={(e) => handleCompile()}>handleCompile</button>
    </div>
  );
};

export default Test;
