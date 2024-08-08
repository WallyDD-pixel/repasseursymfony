const NodeMediaServer = require('node-media-server');

const config = {
    rtmp: {
      port: 1935,
      chunk_size: 100000, // Augmenter chunk_size
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: 8000,
      mediaroot: './media',
      allow_origin: '*'
    },
    trans: {
      ffmpeg: 'C:/Users/stanis/scoop/shims/ffmpeg.exe',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=4:hls_list_size=2:hls_flags=delete_segments]', // Ajuster hlsFlags
          dash: true,
          dashFlags: '[f=dash:window_size=5:extra_window_size=5]' // Ajuster dashFlags
        }
      ]
    }
  };
var nms = new NodeMediaServer(config);
nms.run();