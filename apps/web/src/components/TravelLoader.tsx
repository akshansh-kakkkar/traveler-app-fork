import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

type TravelerLoaderPorps = {
	onComplete: () => void;
};

export default function TravelLoader({ onComplete }: TravelerLoaderPorps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const lineRef = useRef<HTMLDivElement>(null);
	const onCompleteRef = useRef(onComplete);

	useLayoutEffect(() => {
		onCompleteRef.current = onComplete;
	}, [onComplete]);

	useLayoutEffect(() => {
		const root = rootRef.current;
		const line = lineRef.current;

		if (!root || !line) return;

		const ctx = gsap.context(() => {
			gsap.set(line, { scaleX: 0 });

			gsap.to(line, {
				scaleX: 1,
				duration: 1.6,
				ease: "power2.inOut",
				onComplete: () => onCompleteRef.current(),
			});
		}, root);

		return () => ctx.revert();
	});

	return (
		<div
			ref={rootRef}
			className="fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center overflow-hidden bg-[#12271A] text-center"
		>
			<div className="w-48 sm:w-64">
				<div className="h-2 w-full overflow-hidden rounded-sm bg-white/10">
					<div
						ref={lineRef}
						className="h-full w-full origin-left bg-[#A8C3A9]"
					/>
				</div>
				<div className="font-bold text-[#A8C3A9] text-lg">Tournet</div>
			</div>
		</div>
	);
}
