import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const fontUrl = Object.values(Ionicons.font)[0] as string;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
        {fontUrl ? (
          <style
            dangerouslySetInnerHTML={{
              __html: `@font-face{font-family:"ionicons";src:url("${fontUrl}");font-display:swap;}`,
            }}
          />
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
