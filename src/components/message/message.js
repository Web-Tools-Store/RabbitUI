// 全局配置项
let messageZIndex = 1000;
let messageDuration = 2.5;
let messageTop = 24;

/**
 * Message 全局提示
 * 轻量级的信息反馈组件。
 */
Rabbit.prototype.Message = {
    /**
     * ------------------------------------------------------------------------
     * 初始化父容器
     * ------------------------------------------------------------------------
     */

    container: () => {
        const MessageContainer = document.createElement("div");

        MessageContainer.className = "rbt-message";
        setTimeout(() => (MessageContainer.style.top = `${messageTop}px`), 0);

        document.body.appendChild(MessageContainer);
    },

    /**
     * 参数类型说明
     * @param {{ key: string | number,
     *           type: string,
     *           onClose: function,
     *           content: string,
     *           duration: number,
     *           closable: boolean,
     *           background: boolean }}
     * @returns {HTMLElement}
     */
    _createInstance({
        key,
        type,
        onClose,
        content,
        duration,
        closable,
        background,
    } = {}) {
        // 是否初始化了 message 的父容器
        if (!document.querySelector(".rbt-message")) {
            console.error("[Rabbit warn] The Message component is not initialized");
            return;
        }
        // 全局的自动关闭的延时如果不是 2.5 则说明被更改了，所以实例的 duration 同步为全局的 duration
        if (messageDuration != 2.5) {
            duration = messageDuration;
        }
        // 获取图标
        const MessageIcons = getIconTypes(type);

        const Message = document.createElement("div");
        const MessageNoticeContent = document.createElement("div");
        const MessageTypeBox = document.createElement("div");
        const MessageIconBox = document.createElement("i");
        const MessageContentBox = document.createElement("span");
        const MessageClose = document.createElement("a");

        this._addClassName(
            type,
            MessageIcons,
            Message,
            MessageNoticeContent,
            MessageTypeBox,
            MessageIconBox,
            MessageClose
        );

        document.querySelector(".rbt-message").appendChild(Message);
        Message.appendChild(MessageNoticeContent);
        MessageNoticeContent.appendChild(MessageTypeBox);
        MessageTypeBox.append(MessageIconBox, MessageContentBox);
        // 是否显示关闭按钮
        if (closable) {
            MessageTypeBox.appendChild(MessageClose);
        }

        this._setKey(key, Message);
        this._setContent(MessageContentBox, content);
        this._closeInstacne(Message, duration);
        this._showBackground(background, MessageNoticeContent, type);
        this._clickCloseHandle(MessageClose, onClose);

        return Message;
    },

    _addClassName(
        type,
        MessageIcons,
        Message,
        MessageNoticeContent,
        MessageTypeBox,
        MessageIconBox,
        MessageClose
    ) {
        const prefixCls = "rbt-message";
        const prefixIcon = "rbt-icon";

        Message.className = `${prefixCls}-notice ${this._aniCls().moveInCls}`;
        MessageNoticeContent.className = `${prefixCls}-notice-content`;
        MessageTypeBox.className = `${prefixCls}-${type}`;
        MessageIconBox.className = `${prefixIcon} ${prefixIcon}-${MessageIcons}`;
        MessageClose.className = `${prefixIcon} ${prefixIcon}-ios-close`;
    },

    _aniCls() {
        const moveInCls = "rbt-message-notice-fade-enter";
        const moveOutCls = "rbt-message-notice-fade-leave";
        return {
            moveInCls,
            moveOutCls,
        };
    },

    _showBackground(background, el, type) {
        if (background) {
            el.classList.add(`rbt-message-with-background-${type}`);
        }
    },

    _setKey(key, el) {
        if (isNum(key) || isStr(key)) {
            el.dataset.key = key;
        }
    },

    _setContent(el, content) {
        if (content) {
            el.innerHTML = content;
        }
    },

    _closeInstacne(el, duration) {
        // 销毁实例
        destroy({
            el,
            duration,
            moveInCls: this._aniCls().moveInCls,
            moveOutCls: this._aniCls().moveOutCls,
            whenToDestroy: 0.25,
        });
    },

    _clickCloseHandle(el, cb) {
        clickDestroy({
            el,
            moveInCls: this._aniCls().moveInCls,
            moveOutCls: this._aniCls().moveOutCls,
            destroyTarget: document.querySelector(".rbt-message-notice"),
            onClose: cb,
        });
    },

    /**
     * ------------------------------------------------------------------------
     * 调用以下方法创建实例
     * ------------------------------------------------------------------------
     */

    info(
        content, { key, onClose, duration = 2.5, closable = false, background = false } = {}
    ) {
        this._createInstance({
            key,
            type: "info",
            content,
            onClose,
            duration,
            closable,
            background,
        });
        return PromiseAfterClose(duration);
    },

    success(
        content, { key, onClose, duration = 2.5, closable = false, background = false } = {}
    ) {
        this._createInstance({
            key,
            type: "success",
            content,
            onClose,
            duration,
            closable,
            background,
        });
        return PromiseAfterClose(duration);
    },

    warning(
        content, { key, onClose, duration = 2.5, closable = false, background = false } = {}
    ) {
        this._createInstance({
            key,
            type: "warning",
            content,
            onClose,
            duration,
            closable,
            background,
        });
        return PromiseAfterClose(duration);
    },

    error(
        content, { key, onClose, duration = 2.5, closable = false, background = false } = {}
    ) {
        this._createInstance({
            key,
            type: "error",
            content,
            onClose,
            duration,
            closable,
            background,
        });
        return PromiseAfterClose(duration);
    },

    loading(
        content, { key, onClose, duration = 2.5, closable = false, background = false } = {}
    ) {
        this._createInstance({
            key,
            type: "loading",
            content,
            onClose,
            duration,
            closable,
            background,
        });
        return PromiseAfterClose(duration);
    },

    /**
     * ------------------------------------------------------------------------
     * 全局配置方法
     * ------------------------------------------------------------------------
     * @param {{ top: number, duration: number }}
     */

    config: ({ top, duration } = {}) => {
        if (isNum(top)) {
            messageTop = top;
        }
        if (isNum(duration)) {
            messageDuration = duration;
        }
    },

    /**
     * ------------------------------------------------------------------------
     * 全局销毁方法
     * ------------------------------------------------------------------------
     */

    destroy(key) {
        // 如果传入 key 则单独销毁该组件，反之
        if (key) {
            destroyByKey({
                key,
                target: document.querySelectorAll(".rbt-message-notice"),
                moveInCls: this._aniCls().moveInCls,
                moveOutCls: this._aniCls().moveOutCls,
                whenToDestroy: 0.25,
            });
        } else {
            destoryAll({
                el: document.querySelectorAll(".rbt-message-notice"),
                moveInCls: this._aniCls().moveInCls,
                moveOutCls: this._aniCls().moveOutCls,
                whenToDestroy: 0.25,
            });
        }
    },
};