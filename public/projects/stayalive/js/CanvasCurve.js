CanvasRenderingContext2D.prototype.curve = function (h, t, f, c) {
    t = typeof t === 'number' ? t : 0.5;
    f = f ? f : 25;
    var j,
        m = (h.length - 2) * f + 2 + (c ? 2 * f : 0),
        n = 0,
        k = new Float32Array(m),
        e = h.length,
        d,
        a = new Float32Array((f + 2) * 4),
        b = 4;
    j = h.slice(0);
    if (c) {
        j.unshift(h[e - 1]);
        j.unshift(h[e - 2]);
        j.push(h[0], h[1]);
    } else {
        j.unshift(h[1]);
        j.unshift(h[0]);
        j.push(h[e - 2], h[e - 1]);
    }
    a[0] = 1;
    for (d = 1; d < f; d++) {
        var o = d / f,
            p = o * o,
            r = p * o,
            q = r * 2,
            s = p * 3;
        a[b++] = q - s + 1;
        a[b++] = s - q;
        a[b++] = r - 2 * p + o;
        a[b++] = r - p;
    }
    a[++b] = 1;
    g(j, a, e);
    if (c) {
        j = [];
        j.push(h[e - 4], h[e - 3], h[e - 2], h[e - 1]);
        j.push(h[0], h[1], h[2], h[3]);
        g(j, a, 4);
    }

    function g(G, z, B) {
        for (var A = 2; A < B; A += 2) {
            var C = G[A],
                D = G[A + 1],
                E = G[A + 2],
                F = G[A + 3],
                I = (E - G[A - 2]) * t,
                J = (F - G[A - 1]) * t,
                K = (G[A + 4] - C) * t,
                L = (G[A + 5] - D) * t;
            for (var H = 0; H < f; H++) {
                var u = H << 2,
                    v = z[u],
                    w = z[u + 1],
                    x = z[u + 2],
                    y = z[u + 3];
                k[n++] = v * C + w * E + x * I + y * K;
                k[n++] = v * D + w * F + x * J + y * L;
            }
        }
    }

    e = c ? 0 : h.length - 2;
    k[n++] = h[e];
    k[n] = h[e + 1];
    for (d = 0, e = k.length; d < e; d += 2) {
        this.lineTo(k[d], k[d + 1]);
    }
    return k;
};
