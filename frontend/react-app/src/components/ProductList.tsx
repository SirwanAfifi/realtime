import React from "react";

const ProductList = () => {
    const [data, setData] = React.useState([] as any);

    // Create our number formatter.
    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'gbp',
    });

    React.useEffect(() => {
        let eventSource = new EventSource("http://localhost:8000/stream");
        eventSource.onmessage = e => updateProdutList(JSON.parse(e.data));
    }, []);

    const updateProdutList = (product: any) => {
        setData([...product])
    }

    return <table className="table table-hover">
        <thead className="thead-dark">
            <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            {data.map((p: any) =>
                <tr key={p.Id}>
                    <td>{p.Id}</td>
                    <td>{p.Title}</td>
                    <td>{formatter.format(p.Price)}</td>
                </tr>)}
        </tbody>
    </table>
}

export { ProductList }