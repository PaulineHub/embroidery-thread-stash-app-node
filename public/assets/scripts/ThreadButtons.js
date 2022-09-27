import ThreadStorage from './ThreadStorage.js';
import CloneItem from './CloneItem.js';

export default class ThreadButtons {

    constructor(el, token) {
        this._el = el;
        this._elShopBtn = this._el.querySelector('[data-js-basket-btn]');
        this._elStoreBtn = this._el.querySelector('[data-js-box-btn]');
        this._elDeleteBtn = this._el.querySelector('[data-js-delete]');
        this._elQuantityBtn = this._el.querySelector('[data-js-quantity]');
        this._elWindowTemplate = document.querySelector('[data-js-window-template]');
        this._elMainBlock = document.querySelector('main');

        this.storage = new ThreadStorage(this.token);
        this.token = token;

        this.init();
    }
    
    /***
     * Initiate behaviors by default 
     */
    init() {  

        if (this._elShopBtn) {
            this._elShopBtn.addEventListener('click', (e) => {
                this.displayWindow(e, 'Add to my Shopping Basket');
            });
        }

        if (this._elStoreBtn) {
            this._elStoreBtn.addEventListener('click', (e) => {
                this.displayWindow(e, 'Add to my Thread Box');
            });
        }

        if (this._elDeleteBtn) {
            this._elDeleteBtn.addEventListener('click', (e) => {
                const thread = e.target.parentElement.parentElement.parentElement.parentElement;
                const container = thread.parentElement;
                this.storage.deleteThread(container, thread);
            });
        }

        if (this._elQuantityBtn) { 
            this._elQuantityBtn.addEventListener('click', (e) => {
                this.displayWindow(e, 'Update Quantity');
            });
        }
    }

    displayWindow(e, actionString) {
        const storage = e.currentTarget.dataset.jsStorage;
        const thread = e.currentTarget.parentElement.parentElement.parentElement.parentElement;
        console.log(thread);
        const threadQuantity = parseInt(thread.dataset.jsThreadQuantity);
        const threadWrapper = thread.parentElement;
        const threadWrapperValue = threadWrapper.dataset.jsThreadsWrapper;
        let infos = {
                id: thread.id,
                code:  this._el.querySelector(".item-code").innerHTML,
                quantity: threadQuantity,
                storageTo: storage,
                action: actionString
        };
        new CloneItem(infos, this._elWindowTemplate, this._elMainBlock, this.token);
        this.listenWindowBtns(threadWrapperValue);
    }

    listenWindowBtns(containerFrom) {
        // listen close btn
        const elCloseWindowBtn = document.querySelector('[data-js-close-window]');
        elCloseWindowBtn.addEventListener('click', this.closeWindow.bind(this));
        // listen submit btn
        const elSubmitBtn = document.querySelector('[data-js-submit-quantity]');
        elSubmitBtn.addEventListener('click', (e) => {     
            let quantity = parseInt(document.querySelector('[data-js-quantity-input]').value);
            if (elSubmitBtn.innerHTML == 'Update Quantity') {
                this.storage.updateThread(e, quantity);
            } else {
                this.storage.storeThread(e, quantity, containerFrom);
            }
            this.closeWindow();
        });
    }

    closeWindow() {
        const elWindow = document.querySelector('[data-js-window]');
        this._elMainBlock.removeChild(elWindow);
    }

}

