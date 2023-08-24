import { es6 } from "../frame/storeMan.js";
import { deepClone } from "../frame/clone.js";


let maxSkuBuyTotalNum = 10;

class BaseCart {
    // items = []
    items = []

    get checkedLen() {
        let count = 0;
        if (!this.items || this.items.length < 1) {
            return 0;
        }
        this.items.forEach((item) => {
            if (item[1].checked) {
                count = item[1].num + count
            }
        })
        return count
    }

    clearAllItems() {
        this.items.splice(0)
    }

    pushItem(skuIdDisplay, { num = 1, checked = true, extra = {} } = {}) {
        let keys = this.items.map(v => v[0]);
        let index = keys.findIndex(key => key === skuIdDisplay);
        if (index < 0) {
            this.items.push([skuIdDisplay, { num: num, checked, extra }]);
        } else {
            this.items[index][1].num = this.items[index][1].num + 1;
            // console.log('pushItem', this.items);
        }
    }

    filterItems(conditions = []) {
        return findAll(deepClone(unref(this.items)), conditions)
    }

    delItem(index) {
        this.items.splice(index, 1)
    }

    toggleItemChecked(item) {
        item[1].checked = !item[1].checked
    }

    toggleCheckAll() {
        let checked = this.checkedLen > 0 ? false : true
        this.items.forEach(item => {
            item[1].checked = checked
        })
    }

    getSelectedItems() {
        const { unref } = window.VueDemi;
        let res = deepClone(unref(this.items))
        return res.filter(v => {
            return v[1].checked
        })
    }

    getSelectedCount() {
        let items = this.getSelectedItems()
        if (!items) {
            return 0;
        }
        let count = 0;
        items.forEach(item => {
            count = item[1].num + count
        })
        return count
    }

    get curMaxNum() {
        // console.log('curMaxNum', this.getSelectedCount());
        return maxSkuBuyTotalNum - this.getSelectedCount()
    }
}


es6.partialStore(BaseCart);


/**
 * 
 * @param {} extra 
 * @returns { {checked: boolean, num: number, extra: any} } 
 */
function createBaseListItemConfig(extra = {}) {
    return {
        checked: true,
        num: 1,
        extra
    }
}

class Cart extends BaseCart {
    getCollect({ priceKey = 'sku_price' } = {}) {
        let originItems = deepClone(this.items)
        let items = this.getSelectedItems()
        let res = deepClone(items)
        let num = 0;
        let price = 0;
        let price_display = 0;
        res.forEach(item => {
            let curNum = item[1].num;
            let curPerPrice = getObj(item[1]?.extra ?? {}, priceKey, 0)
            item[1].curTotal = curPerPrice * curNum
            num = num + parseFloat(curNum);
            price = price + item[1].curTotal;
            price_display = transform(price)
            // console.log(item[1]);
        })
        // console.log('getSelectedItems', items, res);
        return { num, price, price_display, originItems, items: res }
    }

    putSku(sku_id = '', item) {
        this.pushItem(sku_id, createBaseListItemConfig(item))
    }
}

es6.injectStore(Cart, {
    partials: [
        ['BaseCart'],
    ]
})