import type { InjectionKey, Ref } from 'vue';
import {
  defineComponent,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  readonly,
  ref,
} from 'vue';
import type {
  MouseEventHandler,
  PropsWithChildren,
  KeyboardEventHandler,
  HTMLAttributes,
  KeyboardEvent,
} from 'react';
import clsx from 'clsx';
import { Keys } from '~/types';

// hooks
import { useClickAway } from '~/hooks';

enum Focus {
  First,
  Previous,
  Next,
  Last,
}

interface Api {
  activeItemId: Readonly<Ref<string | undefined>>;
  menuState: Readonly<Ref<MenuState>>;
  menuItemsRef: Ref<HTMLUListElement | undefined>;
  menuButtonRef: Ref<HTMLButtonElement | undefined>;
  closeMenu: () => void;
  openMenu: () => void;
  focus: (index: Focus | number) => void;
  register: (id: string, ref: Ref<any>) => void;
  unregister: (id: string) => void;
  setActive: (id: string) => void;
}

const MenuContext: InjectionKey<Api> = Symbol('MenuContext');

const useMenuContext = (component: string) => {
  const ctx = inject(MenuContext);

  if (!ctx)
    throw new Error(`<${component}> is missing a parent <Menu /> component.`);

  return ctx;
};

enum MenuState {
  Opened,
  Closed,
}

interface MenuProps {}

export const Menu = defineComponent<MenuProps>((props, { slots }) => {
  const menuState = ref(MenuState.Closed);

  const menuItemsRef = ref<HTMLUListElement>();
  const menuButtonRef = ref<HTMLButtonElement>();

  const items: { id: string; ref: HTMLElement }[] = [];
  const activeItemId = ref<string>();
  const activeFocussedItemId = ref<string>();

  const closeMenu = () => {
    menuState.value = MenuState.Closed;
  };

  const openMenu = () => {
    menuState.value = MenuState.Opened;
  };

  const register = (id: string, ref: Ref<HTMLElement>) => {
    items.push({ id, ref: ref.value });
  };

  const unregister = (id: string) => {
    items.splice(
      items.findIndex((a) => a.id === id),
      1
    );
  };

  const setActive = (id: string) => {
    activeItemId.value = id;
  };

  const focus = (id: Focus | string) => {
    const i = items.findIndex((a) => a.id === activeFocussedItemId.value);

    switch (id) {
      case Focus.First:
        focus(items[0].id);
        break;
      case Focus.Last:
        focus(items[items.length - 1].id);
        break;
      case Focus.Previous:
        const prevIndex = i - 1;
        prevIndex == -1 ? focus(Focus.Last) : focus(items[prevIndex].id);
        break;
      case Focus.Next:
        const nextIndex = i + 1;
        nextIndex == items.length
          ? focus(Focus.First)
          : focus(items[nextIndex].id);
        break;
      default:
        items.find((a) => a.id === id)?.ref.focus();
        activeFocussedItemId.value = id;
        break;
    }
  };

  provide(MenuContext, {
    activeItemId: readonly(activeItemId),
    menuState: readonly(menuState),
    menuItemsRef,
    menuButtonRef,
    closeMenu,
    openMenu,
    focus,
    register,
    unregister,
    setActive,
  });

  return () => (
    <div className="relative h-max">{slots.default && slots.default()}</div>
  );
});

interface ButtonProps {}

export const MenuButton = defineComponent<ButtonProps>((props, { slots }) => {
  const api = useMenuContext('MenuButton');

  // https://www.w3.org/WAI/GL/wiki/Using_ARIA_menus
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case Keys.Space:
      case Keys.Enter:
      case Keys.ArrowDown:
        e.preventDefault();
        e.stopPropagation();
        api.openMenu();

        nextTick(() => {
          api.focus(Focus.First);
        });
        break;
      case Keys.ArrowUp:
        e.preventDefault();
        e.stopPropagation();
        api.openMenu();

        nextTick(() => {
          api.focus(Focus.Last);
        });
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case Keys.Space:
        // required for firefox, because the space key doesn't cancel the keyUp event
        e.preventDefault();
        break;
    }
  };

  const handleClick = (e: MouseEvent) => {
    api.menuState.value === MenuState.Opened ? api.closeMenu() : api.openMenu();
  };

  return () => (
    <>
      <button
        ref={api.menuButtonRef}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={handleClick}
        className="flex h-max gap-2 py-2 font-semibold text-white"
      >
        {slots.default && slots.default()}
      </button>
    </>
  );
});

export const MenuItems = defineComponent((props, { slots }) => {
  const api = useMenuContext('MenuItems');

  const handleKeyDown: KeyboardEvent = (e) => {
    switch (e.key) {
      case Keys.Escape:
        e.preventDefault();
        e.stopPropagation();
        api.closeMenu();

        nextTick(() => {
          api.menuButtonRef.value?.focus();
        });
        break;
      case Keys.ArrowUp:
        e.preventDefault();
        e.stopPropagation();
        api.focus(Focus.Previous);
        break;
      case Keys.ArrowDown:
      case Keys.Tab:
        e.preventDefault();
        e.stopPropagation();
        api.focus(Focus.Next);
    }
  };

  useClickAway(api.menuItemsRef, () => {
    api.closeMenu();

    nextTick(() => {
      api.menuItemsRef.value?.focus();
    });
  });

  if (api.menuState.value === MenuState.Opened) {
    return (
      <div className="bg-bodySecundary absolute z-20 mt-2 rounded-xl py-3 shadow-xl">
        <ul ref={api.menuItemsRef} onKeyDown={handleKeyDown}>
          {slots.default && slots.default()}
        </ul>
      </div>
    );
  }
});

interface MenuItemProps extends HTMLAttributes<HTMLLIElement> {}

export const MenuItem = ({ children }: PropsWithChildren<MenuItemProps>) => {
  const api = useMenuContext('MenuItem');
  const id = Math.random().toString(36);

  const internalRef = ref<HTMLLIElement>();

  onMounted(() => api.register(id, internalRef));
  onUnmounted(() => api.unregister(id));

  // TODO: would be better if this is an api function
  const isActive = api.activeItemId.value === id;

  const handleClick: MouseEventHandler = (e) => {
    api.closeMenu();
    api.setActive(id);
    // TODO: emit the value
    // emit('select', e);

    // set the focus back to the menu button
    nextTick(() => api.menuButtonRef.value?.focus());
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    switch (e.key) {
      case Keys.Enter:
      case Keys.Space:
        e.preventDefault();
        e.stopPropagation();
        api.closeMenu();
        api.setActive(id);

        // emit('select', e);

        // set the focus back to the menu button
        nextTick(() => api.menuButtonRef.value?.focus());
        break;
      default:
        break;
    }
  };

  const handleMove: MouseEventHandler = (e) => {
    // @ts-ignore
    api.focus(e.target.id);
  };

  return (
    <li
      id={id}
      ref={internalRef}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMove}
      onPointerMove={handleMove}
      className={clsx(
        `cursor-pointer select-none px-4 py-2 font-semibold text-white focus:bg-background/80 focus:outline-none`,
        isActive && 'text-primary'
      )}
    >
      {children}
    </li>
  );
};
