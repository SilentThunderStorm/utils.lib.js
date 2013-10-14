var utils =
{
    // Extremely flexible timer system
	timer:function(duration, callbacks, options)
	{
		if(this instanceof timer)
		{
			if 
			( 
				typeof arguments[0] != 'number' && 
				typeof arguments[1].onfinish ==='undefined'
			) 
			{
				throw ("Timer requires, at minimum, a duration and an 'onfinish' callback.");
			}
			
			var self = this;
			
			this.duration = arguments[0];
			this.progress = 0;
			this.time = 0;
			this.status = 'ready';
			
			// Callbacks
			var onstart = arguments[1].onstart||null,
			onprogress = arguments[1].onprogress||null,
			onpause = arguments[1].onpause||null,
			onabort = arguments[1].onabort||null,
			onreset = arguments[1].onreset||null,
			onfinish = arguments[1].onfinish||arguments[1];
			
			// Option Flags
			if(typeof arguments[2] == 'undefined') arguments[2] = '';
			this.continuous = arguments[2].continuous||false;
			// TODO this.global = arguments[2].global||null;
			this.ease = arguments[2].ease||null;
					
			var current = 0, total = 0;
			
			// Main methods
			this.start = function()
			{
				var msg = (this.status == 'paused')?'Restarting':'Starting';
				this.status = 'running';
				current = new Date().getTime();
				this.run();
				if(onstart)onstart(msg);
				return this;
			};
			this.pause = function()
			{
				var now = new Date().getTime();
				total += now - current;
				current = now;
				this.status = 'paused';
				if(onpause)onpause(total);
				return total;
			};
			this.abort = function()
			{
				this.time = this.progress = 0;
				total = current = 0;
				this.status = 'aborted';
				if(onabort)onabort();
				return false;
			};
			this.reset = function()
			{
				this.time = this.progress = 0;
				total = current = 0;
				this.status = 'ready';
				if(onreset)onreset();
				return true;
			};
			
			// Main loop
			this.run = function()
			{
				if(this.status != 'running') return false;
				
				var now = new Date().getTime();
				this.time = now-current+total;
				
				this.progress = this.time / this.duration;
				
				if(onprogress) onprogress((this.progress>1)?1:this.progress);
				
				var ease;
				if(this.ease) ease((this.progress>1)?1:this.progress);
				
				if (this.progress > 1)
				{
					onfinish();
					this.reset();
					if((!!this.continuous) && (this.status != 'aborted'))this.start();
					return true;
				}
					
				requestAnimationFrame(function(){self.run()});
			};
		}
		else return new timer(duration, callbacks, options);
	}
};