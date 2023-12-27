import { writeFile } from "fs";

interface ProductsQty {
    art: number;
    stock: {
        [size: string]: number;
    }
}

interface sizes {
    name: string;
    origName: string;
    rank: number;
    optionId: number;
    returnCost: number;
    stocks?: stocks[];
    time1: number;
    time2: number;
    wh: number;
    sign: string;
    payload: string;
}

interface stocks {
    wh: number;
    qty: number;
    priority: number;
    time1: number;
    time2: number;
}

// Получить при помощи одного запроса имеая артикулы всех товаров
const getCard_resp1 = async () => {
    const url      = "https://card.wb.ru/cards/v1/detail?dest=-1257786&nm=189785767;160738996;183270278;183269075;183266945;36328331;146972802;154611222;166416619;166417437;190456385;190879343;178144226;178142953;183271022;182770058;160737571;190627235;160740830;173462958;67508839";
    const response = await fetch(url);
    const products = await response.json();

    const productsQty: ProductsQty[] = [];
    products.data.products.forEach((element: { id: number, sizes: sizes[] }) => {
        const sizes: ProductsQty = {
            art: element.id,
            stock: {}
        };

        element.sizes.forEach((size: sizes) => {
            size.stocks && size.stocks[0] ? sizes["stock"][size.origName] = size.stocks[0].qty : undefined;
        });

        productsQty.push(sizes);
    });

    writeFile("./qty_response_1.json", JSON.stringify(productsQty), (err) => {
        err && console.log(err);
    });
}


// Получить при помоши 2х запросов имея артикул только одного товра
const getCard_resp2 = async () => {
    const url      = "https://basket-10.wbbasket.ru/vol1469/part146972/146972802/info/ru/card.json";
    const response = await fetch(url);
    const data     = await response.json();

    const nm_id: { nm_id: number }[] = data.full_colors;
    const id: string = nm_id.map(value => { return value.nm_id }).join(';');

    const salesmanProducts = await fetch("https://card.wb.ru/cards/v1/detail?dest=-1257786&nm=" + id);
    const products         = await salesmanProducts.json();

    const productsQty: ProductsQty[] = [];
    products.data.products.forEach((element: { id: number, sizes: sizes[] }) => {
        const sizes: ProductsQty = {
            art: element.id,
            stock: {}
        };

        element.sizes.forEach((size: sizes) => {
            size.stocks && size.stocks[0] ? sizes["stock"][size.origName] = size.stocks[0].qty : undefined;
        });

        productsQty.push(sizes);
    });

    writeFile("./qty_response_2.json", JSON.stringify(productsQty), (err) => {
        err && console.log(err);
    });
}

getCard_resp1();
getCard_resp2();