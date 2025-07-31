import { component$, Slot } from "@builder.io/qwik";

export const Header = component$(() => {
  return (
    <header class="w-full h-16 bg-white border-b flex items-center px-6 justify-between">
      <div class="text-xl font-semibold text-gray-800">
        <Slot name="title" />
      </div>
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          <span class="font-bold">U</span>
        </div>
      </div>
    </header>
  );
});

export default Header;
