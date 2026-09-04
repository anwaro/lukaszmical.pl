import {ImageResponse} from 'next/og';

export const alt = 'Łukasz Micał';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    background:
                        'linear-gradient(135deg, #0b0b0f 0%, #1e1b3a 100%)',
                    color: '#ffffff',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        fontSize: 40,
                        letterSpacing: 4,
                        textTransform: 'uppercase',
                        color: '#a78bfa',
                    }}
                >
                    lukaszmical.pl
                </div>
                <div style={{fontSize: 110, fontWeight: 700, marginTop: 24}}>
                    Łukasz Micał
                </div>
                <div style={{fontSize: 44, color: '#cbd5e1', marginTop: 12}}>
                    Web developer · interactive projects
                </div>
            </div>
        ),
        size,
    );
}
