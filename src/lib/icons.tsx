/* Free (MIT) stand-ins for the commercial @central-icons-react set used upstream
 * in SidebarNav. Same export names and a `size` prop, so the component body is
 * unchanged and `npm install nexi-agent` needs no icon license key. */
import {
  Check,
  EditPencil,
  Home,
  IceCream,
  LogOut,
  NavArrowDown,
  Plus,
  Search,
  Settings,
  SidebarCollapse,
  UserPlus,
  Xmark,
} from "iconoir-react";

type IconProps = { size?: number; className?: string };
type IconoirComponent = typeof Home;

function wrap(Icon: IconoirComponent) {
  return function NexiIcon({ size = 18, className }: IconProps) {
    return <Icon width={size} height={size} strokeWidth={1.8} className={className} aria-hidden />;
  };
}

export const IconArrowBoxLeft = wrap(LogOut);
export const IconCheckmark1Small = wrap(Check);
export const IconChevronDownSmall = wrap(NavArrowDown);
export const IconCrossSmall = wrap(Xmark);
export const IconEditBig = wrap(EditPencil);
export const IconHome = wrap(Home);
export const IconMagnifyingGlass = wrap(Search);
export const IconPlusMedium = wrap(Plus);
export const IconPopsicle2 = wrap(IceCream);
export const IconSettingsGear1 = wrap(Settings);
export const IconSidebarLeftArrow = wrap(SidebarCollapse);
export const IconUserAdd = wrap(UserPlus);
