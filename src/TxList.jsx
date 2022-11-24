export default function TxList({ txs }) {
  if (txs.length === 0) return null;

  return (
    <>
      {txs.map((item) => (
        <div key={item} className=" mt-5">
          <div className="">
            <label>{item.hash}</label>
          </div>
        </div>
      ))}
    </>
  );
}
