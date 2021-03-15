import { useState } from "react";

export default function Index() {
  const [count, setCount] = useState(0);
  const onBtnClick = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <main>
      <h1>Hello, world!</h1>
      <button onClick={onBtnClick}>count: {count}</button>
    </main>
  );
}
