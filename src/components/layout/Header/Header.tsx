import { defineComponent } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

// components
import Logo from '../../base/Logo.vue';
import Container from '../Container.vue';
import Button from '../../base/Button.vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '~/components/base/Menu';
import { Avatar } from '~/components/base/Avatar';

// hooks
import { useAuth, useUser } from '~/hooks';

export const Header = defineComponent(() => {
  const router = useRouter();
  const user = useUser();
  const auth = useAuth();

  const handleLogOutSelect = () => auth.logout();
  const handleLogInClick = () => auth.login();

  return () => (
    <header class="bg-bodyPrimary">
      <Container class="flex items-center justify-between py-3">
        {/* logo */}
        <RouterLink to={{ name: 'Home' }} class="flex gap-3">
          <Logo class="h-[1.7rem] w-[1.7rem]" />
          <h3>Stats.fm</h3>
        </RouterLink>

        {/* TODO: implement search bar */}

        {/* menu */}
        {user ? (
          <Menu>
            <MenuButton>
              <Avatar src={user.image} name={user.displayName} />
            </MenuButton>

            <MenuItems class="right-0">
              <MenuItem
                class="flex gap-2"
                onSelect={() => router.push({ name: 'User', params: { userId: 'me' } })}
              >
                <Avatar src={user.image} name={user.displayName} />

                <div>
                  <h5>{user.displayName}</h5>
                  <p class="m-0">{user.email}</p>
                </div>
              </MenuItem>
              <MenuItem onSelect={() => router.push({ name: 'User', params: { userId: 'me' } })}>
                My page
              </MenuItem>
              <MenuItem onSelect={() => router.push({ name: 'Account' })}>My account</MenuItem>
              <MenuItem onSelect={handleLogOutSelect}>Log out</MenuItem>
            </MenuItems>
          </Menu>
        ) : (
          <Button onClick={handleLogInClick}>Log in</Button>
        )}
      </Container>
    </header>
  );
});
