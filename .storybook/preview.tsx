import type { Preview } from "@storybook/react";
import React, { useEffect } from "react";
import "../src/globals.css";
import { TooltipProvider } from "../src/design-system/components/Tooltip/tooltip";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        showName: true,
      },
    },
    density: {
      name: 'Density',
      description: 'UI density (ui-size + layout-space)',
      defaultValue: 'md',
      toolbar: {
        icon: 'component',
        items: [
          { value: 'md', title: 'Density: md' },
          { value: 'lg', title: 'Density: lg' },
        ],
        showName: true,
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          'Design System', [
            'Tokens',
            'Components', ['*', ['展示', '設計規格', '設計原則']],
            'Patterns',
          ],
        ],
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme ?? 'light') as string;
      const density = (context.globals.density ?? 'md') as string;

      useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-density', density);
      }, [theme, density]);

      // Storybook iframe 的背景由 wrapper div 控制,確保 dark mode 時背景跟隨 --canvas。
      //
      // `margin: -1rem; padding: 1rem` 是為了配合 Storybook 預設的 `layout: 'padded'`
      // ——用負 margin 抵消 Storybook 容器的 outer padding,再用自己的 padding 補回,
      // 讓背景色 bleed 到視窗邊緣。
      //
      // **Fullscreen layout 必須跳過這個 trick**:使用 `position: fixed` 的元件
      // (例如 Sidebar 的固定 panel)座標相對 viewport,而 flex 佈局在 wrapper
      // padding 裡,兩者會錯位,主內容會被 sidebar 蓋住。
      const isFullscreen = context.parameters?.layout === 'fullscreen';
      const wrapperStyle: React.CSSProperties = isFullscreen
        ? { backgroundColor: 'var(--canvas)', color: 'var(--foreground)' }
        : {
            backgroundColor: 'var(--canvas)',
            color: 'var(--foreground)',
            margin: '-1rem',
            padding: '1rem',
          };

      return (
        <TooltipProvider delayDuration={500} skipDelayDuration={300}>
          <div style={wrapperStyle}>
            <Story />
          </div>
        </TooltipProvider>
      );
    },
  ],
};

export default preview;
