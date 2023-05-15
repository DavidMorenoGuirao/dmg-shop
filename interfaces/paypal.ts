// To parse this data:
//
//   import { Convert, PaypalOrderStatusResponse } from "./file";
//
//   const paypalOrderStatusResponse = Convert.toPaypalOrderStatusResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface PaypalOrderStatusResponse {
    id:             string;
    intent:         string;
    status:         string;
    payment_source: PaymentSource;
    purchase_units: PurchaseUnit[];
    payer:          Pay;
    create_time:    Date;
    update_time:    Date;
    links:          Link[];
}

export interface Link {
    href:   string;
    rel:    string;
    method: string;
}

export interface Pay {
    name:          PayerName;
    email_address: string;
    payer_id?:     string;
    address:       PayerAddress;
    account_id?:   string;
}

export interface PayerAddress {
    country_code: string;
}

export interface PayerName {
    given_name: string;
    surname:    string;
}

export interface PaymentSource {
    paypal: Pay;
}

export interface PurchaseUnit {
    reference_id: string;
    amount:       Amount;
    payee:        Payee;
    shipping:     Shipping;
    payments:     Payments;
}

export interface Amount {
    currency_code: string;
    value:         string;
}

export interface Payee {
    email_address: string;
    merchant_id:   string;
}

export interface Payments {
    captures: Capture[];
}

export interface Capture {
    id:                          string;
    status:                      string;
    amount:                      Amount;
    final_capture:               boolean;
    seller_protection:           SellerProtection;
    seller_receivable_breakdown: SellerReceivableBreakdown;
    links:                       Link[];
    create_time:                 Date;
    update_time:                 Date;
}

export interface SellerProtection {
    status:             string;
    dispute_categories: string[];
}

export interface SellerReceivableBreakdown {
    gross_amount: Amount;
    paypal_fee:   Amount;
    net_amount:   Amount;
}

export interface Shipping {
    name:    ShippingName;
    address: ShippingAddress;
}

export interface ShippingAddress {
    address_line_1: string;
    admin_area_2:   string;
    admin_area_1:   string;
    postal_code:    string;
    country_code:   string;
}

export interface ShippingName {
    full_name: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toPaypalOrderStatusResponse(json: string): PaypalOrderStatusResponse {
        return cast(JSON.parse(json), r("PaypalOrderStatusResponse"));
    }

    public static paypalOrderStatusResponseToJson(value: PaypalOrderStatusResponse): string {
        return JSON.stringify(uncast(value, r("PaypalOrderStatusResponse")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "PaypalOrderStatusResponse": o([
        { json: "id", js: "id", typ: "" },
        { json: "intent", js: "intent", typ: "" },
        { json: "status", js: "status", typ: "" },
        { json: "payment_source", js: "payment_source", typ: r("PaymentSource") },
        { json: "purchase_units", js: "purchase_units", typ: a(r("PurchaseUnit")) },
        { json: "payer", js: "payer", typ: r("Pay") },
        { json: "create_time", js: "create_time", typ: Date },
        { json: "update_time", js: "update_time", typ: Date },
        { json: "links", js: "links", typ: a(r("Link")) },
    ], false),
    "Link": o([
        { json: "href", js: "href", typ: "" },
        { json: "rel", js: "rel", typ: "" },
        { json: "method", js: "method", typ: "" },
    ], false),
    "Pay": o([
        { json: "name", js: "name", typ: r("PayerName") },
        { json: "email_address", js: "email_address", typ: "" },
        { json: "payer_id", js: "payer_id", typ: u(undefined, "") },
        { json: "address", js: "address", typ: r("PayerAddress") },
        { json: "account_id", js: "account_id", typ: u(undefined, "") },
    ], false),
    "PayerAddress": o([
        { json: "country_code", js: "country_code", typ: "" },
    ], false),
    "PayerName": o([
        { json: "given_name", js: "given_name", typ: "" },
        { json: "surname", js: "surname", typ: "" },
    ], false),
    "PaymentSource": o([
        { json: "paypal", js: "paypal", typ: r("Pay") },
    ], false),
    "PurchaseUnit": o([
        { json: "reference_id", js: "reference_id", typ: "" },
        { json: "amount", js: "amount", typ: r("Amount") },
        { json: "payee", js: "payee", typ: r("Payee") },
        { json: "shipping", js: "shipping", typ: r("Shipping") },
        { json: "payments", js: "payments", typ: r("Payments") },
    ], false),
    "Amount": o([
        { json: "currency_code", js: "currency_code", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "Payee": o([
        { json: "email_address", js: "email_address", typ: "" },
        { json: "merchant_id", js: "merchant_id", typ: "" },
    ], false),
    "Payments": o([
        { json: "captures", js: "captures", typ: a(r("Capture")) },
    ], false),
    "Capture": o([
        { json: "id", js: "id", typ: "" },
        { json: "status", js: "status", typ: "" },
        { json: "amount", js: "amount", typ: r("Amount") },
        { json: "final_capture", js: "final_capture", typ: true },
        { json: "seller_protection", js: "seller_protection", typ: r("SellerProtection") },
        { json: "seller_receivable_breakdown", js: "seller_receivable_breakdown", typ: r("SellerReceivableBreakdown") },
        { json: "links", js: "links", typ: a(r("Link")) },
        { json: "create_time", js: "create_time", typ: Date },
        { json: "update_time", js: "update_time", typ: Date },
    ], false),
    "SellerProtection": o([
        { json: "status", js: "status", typ: "" },
        { json: "dispute_categories", js: "dispute_categories", typ: a("") },
    ], false),
    "SellerReceivableBreakdown": o([
        { json: "gross_amount", js: "gross_amount", typ: r("Amount") },
        { json: "paypal_fee", js: "paypal_fee", typ: r("Amount") },
        { json: "net_amount", js: "net_amount", typ: r("Amount") },
    ], false),
    "Shipping": o([
        { json: "name", js: "name", typ: r("ShippingName") },
        { json: "address", js: "address", typ: r("ShippingAddress") },
    ], false),
    "ShippingAddress": o([
        { json: "address_line_1", js: "address_line_1", typ: "" },
        { json: "admin_area_2", js: "admin_area_2", typ: "" },
        { json: "admin_area_1", js: "admin_area_1", typ: "" },
        { json: "postal_code", js: "postal_code", typ: "" },
        { json: "country_code", js: "country_code", typ: "" },
    ], false),
    "ShippingName": o([
        { json: "full_name", js: "full_name", typ: "" },
    ], false),
};
