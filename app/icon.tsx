import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#15803d', // deep green for biology
        }}
      >
        🧪
      </div>
    ),
    {
      width: 64,
      height: 64,
    },
  );
}
