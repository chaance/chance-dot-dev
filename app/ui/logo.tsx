import * as React from "react";
import { SVG } from "~/ui/icons";

const LogoSmall = React.forwardRef<
	SVGSVGElement,
	Omit<React.ComponentProps<typeof SVG>, "viewBox">
>(({ title = "Chance the Dev", ...props }, ref) => {
	return (
		<SVG title={title} ref={ref} {...props} viewBox="0 0 593.6767 265.9412">
			<g>
				<path d="M593.4465,66.3962A6.8546,6.8546,0,0,0,590.9353,62.5a6.0257,6.0257,0,0,0-4.3281-1.0734,7.3881,7.3881,0,0,0-4.76,2.896,136.53,136.53,0,0,1-8.9165,14,126.4632,126.4632,0,0,1-9.783,11.8988,69.2857,69.2857,0,0,1-10.303,9.13,45.0486,45.0486,0,0,1-10.6474,5.7274,21.0915,21.0915,0,0,1-3.81,1.0015,12.5122,12.5122,0,0,1-4.1543.0222,8.39,8.39,0,0,1-3.6357-1.4526,6.2882,6.2882,0,0,1-2.2511-3.5948l-.52-1.4684a92.8609,92.8609,0,0,0,15.93-5.7706,74.135,74.135,0,0,0,14.3711-8.7051A49.5979,49.5979,0,0,0,568.688,74.0317a24.7884,24.7884,0,0,0,4.5-12.8943,15.7878,15.7878,0,0,0-1.8172-6.44,14.1958,14.1958,0,0,0-4.8484-5.313,18.796,18.796,0,0,0-8.1379-2.7553,35.3752,35.3752,0,0,0-11.86.9145,49.4268,49.4268,0,0,0-12.5524,4.8434,78.196,78.196,0,0,0-12.12,8.144,85.3667,85.3667,0,0,0-10.6473,10.3156,75.7555,75.7555,0,0,0-4.9391,6.364,8.2181,8.2181,0,0,0-1.12.9984q-5.0241,7.2708-9.6968,13.788a132.1592,132.1592,0,0,1-9.5227,11.8532,73.0994,73.0994,0,0,1-9.8689,9.1423,39.6335,39.6335,0,0,1-10.5614,5.7987,20.6266,20.6266,0,0,1-3.55.2644,16.8118,16.8118,0,0,1-3.896-.4554,8.9779,8.9779,0,0,1-3.4619-1.6547,6.6884,6.6884,0,0,1-2.251-3.1625,21.2968,21.2968,0,0,1-.26-10.3435,42.1025,42.1025,0,0,1,3.8959-11.1454,48.0645,48.0645,0,0,1,6.8393-10.0068,32.35,32.35,0,0,1,8.7427-7.1307,6.2888,6.2888,0,0,1,3.4636-1.1151q1.3838.11,1.5586.9436a10.2075,10.2075,0,0,1-.26,4.2868,12.9136,12.9136,0,0,1-1.8188,4.2088q-2.5965,4.4308-1.731,7.3963a5.6752,5.6752,0,0,0,3.4636,3.8194,10.8029,10.8029,0,0,0,5.887.4591,16.0726,16.0726,0,0,0,6.2314-2.6306,15.0267,15.0267,0,0,0,5.0222-5.8844q1.384-2.8357,2.5975-5.9876a17.8635,17.8635,0,0,0,1.2107-6.4413,15.8789,15.8789,0,0,0-1.4709-6.6725,12.2442,12.2442,0,0,0-4.6744-5.256,19.561,19.561,0,0,0-8.312-2.6393,37.5967,37.5967,0,0,0-12.2061.9741,49.4312,49.4312,0,0,0-12.5525,4.8434,78.2063,78.2063,0,0,0-12.12,8.1439A85.3608,85.3608,0,0,0,435.197,83.9211a75.9351,75.9351,0,0,0-4.8544,6.2384,10.3529,10.3529,0,0,0-.8587.8914L421,105.4958a45.821,45.821,0,0,1-3.4619,4.6645q-2.2524,2.7241-4.9353,5.5233-2.6862,2.8-5.54,5.2812a31.2947,31.2947,0,0,1-5.1085,3.736,4.0542,4.0542,0,0,0-1.4708,1.1185c-.29.3961-.55.3275-.7794-.2121a5.181,5.181,0,0,1,.2591-2.2957q.4311-1.632.7794-3.2507l9.8691-25.2444q2.2484-5.7522.8654-10.364a11.19,11.19,0,0,0-7.2717-7.58,20.6365,20.6365,0,0,0-11.7739-.572,23.2787,23.2787,0,0,0-8.57,4.2445,45.7411,45.7411,0,0,0-7.5318,7.3556,11.5394,11.5394,0,0,0-5.02-6.6681,12.1161,12.1161,0,0,0-8.6575-1.3683,18.4652,18.4652,0,0,0-5.1944,1.76,33.627,33.627,0,0,0-6.4923,4.6656,61.048,61.048,0,0,0-6.06,6.3231,75.3792,75.3792,0,0,0-5.3677,7.33,84.2558,84.2558,0,0,0-4.2356,7.3406c-.0592.0581-.1188.1109-.1778.171l-8.1371,14.2121a36.7434,36.7434,0,0,1-3.1166,4.258,61.94,61.94,0,0,1-4.6753,5.0463q-2.5963,2.5251-5.3676,4.7323a58.1526,58.1526,0,0,1-5.0207,3.6339,3.1238,3.1238,0,0,1-2.164-.7532,1.8692,1.8692,0,0,1-.4331-2.2627q1.729-4.6232,4.5881-12.13,2.8575-7.5032,5.627-14.3866v.1731a18.1836,18.1836,0,0,0,1.4716-3.4558q.6051-1.9215,1.2987-3.6,1.5577-4.0743,1.0385-6.4118a4.6135,4.6135,0,0,0-4.0681-3.4554,27.7414,27.7414,0,0,0-7.7049.1137,31.9376,31.9376,0,0,0-7.0124,1.6385,9.5846,9.5846,0,0,0-4.9345,4.3986,17.7627,17.7627,0,0,0-7.878-3.6664,31.82,31.82,0,0,0-10.8213-.0426,32.6058,32.6058,0,0,0-11.687,4.26,62.8817,62.8817,0,0,0-11.3406,8.4439,74.3615,74.3615,0,0,0-9.869,11.3073,72.5921,72.5921,0,0,0-7.4457,13.0538q-1.1374,2.6065-1.9886,5.19c-.89,1.35-2.0075,2.92-3.3764,4.7362a64.5391,64.5391,0,0,1-4.9344,5.7833,65.55,65.55,0,0,1-5.4538,5.0941,19.8519,19.8519,0,0,1-5.0214,3.2009,1.9853,1.9853,0,0,1-.7793.3072,2.0016,2.0016,0,0,0-.7786.307,3.284,3.284,0,0,1-.6932.2923,5.1835,5.1835,0,0,1,.26-2.2958q.43-1.6317.7793-3.2506l9.8689-25.2445q2.2485-5.752.8655-10.364a11.1582,11.1582,0,0,0-7.3587-7.5646,21.0476,21.0476,0,0,0-11.86-.5572,21.6063,21.6063,0,0,0-9.35,4.8979q5.7136-13.4494,10.4753-24.9165Q212.8856,76.712,215.312,70.58v-.1731a13.3539,13.3539,0,0,0,1.0386-3.6414,5.9663,5.9663,0,0,0-.1731-2.5675,4.633,4.633,0,0,0-4.1552-3.44,28.2027,28.2027,0,0,0-7.6188.0989,26.7536,26.7536,0,0,0-7.5317,1.9879,10.5557,10.5557,0,0,0-4.9344,5.35q-2.2524,5.0623-5.887,13.5659-3.6348,8.5054-7.964,18.8567-4.33,10.3541-9.0906,21.8217-3.5736,8.61-6.9547,16.7974a148.6555,148.6555,0,0,1-16.6774,21.809,114.2678,114.2678,0,0,1-18.5262,16.1723,83.8063,83.8063,0,0,1-17.8339,9.4738,91.3281,91.3281,0,0,1-16.2751,4.5313q-3.81.6555-7.3588.92-3.55.2654-6.8393.3109A62.411,62.411,0,0,1,61.13,190.4252a41.8756,41.8756,0,0,1-13.5047-6.3343,38.043,38.043,0,0,1-9.696-10.1922,52.9592,52.9592,0,0,1-6.1461-13.227,72.23,72.23,0,0,1-2.5973-25.4381,116.8263,116.8263,0,0,1,5.54-28.4818A147.34,147.34,0,0,1,47.7119,77.8536,144.9532,144.9532,0,0,1,67.45,51.3439a137.5926,137.5926,0,0,1,25.885-21.507A108.523,108.523,0,0,1,124.5864,16.064,43.4215,43.4215,0,0,1,136.88,14.9018a26.08,26.08,0,0,1,9.1765,2.1444,17.4234,17.4234,0,0,1,6.1461,4.57,17.846,17.846,0,0,1,3.3766,6.0854,60.05,60.05,0,0,1-.5193,14.8928A80.9008,80.9008,0,0,1,150.8176,58.82a96.9867,96.9867,0,0,1-7.705,15.9557A83.52,83.52,0,0,1,132.4643,88.987a63.2742,63.2742,0,0,1-13.2456,10.8488,43.3211,43.3211,0,0,1-15.41,5.8533,20.1819,20.1819,0,0,1-8.31-.3015,6.953,6.953,0,0,1-5.3677-4.9636,15.8958,15.8958,0,0,1,1.2117-11.8092A49.7443,49.7443,0,0,1,99.3077,76.77a79.6807,79.6807,0,0,1,10.9945-10.2023,73.5361,73.5361,0,0,1,10.4752-6.91,6.7121,6.7121,0,0,0,2.77-3.3339,6.192,6.192,0,0,0,0-3.5488,8.4977,8.4977,0,0,0-2.9435-3.8228,4.4325,4.4325,0,0,0-4.502-.61,57.7293,57.7293,0,0,0-12.12,6.5A107.801,107.801,0,0,0,91.776,64.6473a111.648,111.648,0,0,0-11.0807,11.861A86.5756,86.5756,0,0,0,72.0381,89.339a51.49,51.49,0,0,0-5.0215,12.6368,20.4634,20.4634,0,0,0,.0869,11.0665,19.2946,19.2946,0,0,0,4.6744,8.0263,23.077,23.077,0,0,0,7.0995,4.8389,26.0252,26.0252,0,0,0,8.4834,2.09,34.81,34.81,0,0,0,8.6572-.3636,60.7563,60.7563,0,0,0,20.0843-7.6968,116.7555,116.7555,0,0,0,20.0849-14.8817A160.7464,160.7464,0,0,0,154.28,85.4937a145.9964,145.9964,0,0,0,14.2841-21.8488,98.0838,98.0838,0,0,0,8.57-21.8184,44.0961,44.0961,0,0,0,.9524-19.3825,28.5675,28.5675,0,0,0-6.4931-11.0032,32.8556,32.8556,0,0,0-11.6868-7.8586A52.1012,52.1012,0,0,0,142.94.0946a85.1272,85.1272,0,0,0-22.3353,2.1109,115.2468,115.2468,0,0,0-34.109,12.5326A158.2441,158.2441,0,0,0,55.33,37.4136,184.88,184.88,0,0,0,29.1855,67.6217a175.6724,175.6724,0,0,0-18.8724,34.845A145.2731,145.2731,0,0,0,.79,139.4255,104.0355,104.0355,0,0,0,2.6943,175.89a63.9391,63.9391,0,0,0,10.9945,21.31A60.5515,60.5515,0,0,0,30.311,211.7424a66.275,66.275,0,0,0,20.43,7.8264,78.7043,78.7043,0,0,0,22.2491,1.3665q1.9032-.156,3.8089-.395,1.9032-.2418,3.809-.5691a102.5944,102.5944,0,0,0,28.049-9.153A135.68,135.68,0,0,0,133.59,195.0157q5.7272-4.585,10.8227-9.5632a3.2165,3.2165,0,0,0,.0841.3285,4.3169,4.3169,0,0,0,3.8958,3.485,38.03,38.03,0,0,0,7.705-.1128,25.4562,25.4562,0,0,0,7.964-1.8892q2.9471-1.3755,4.8484-5.5093,2.0769-4.8569,5.3675-12.7832,3.2871-7.9224,7.2718-17.44,2.9416-5.0055,6.4062-9.7583,3.4611-4.751,6.2332-8.2578,2.7678-3.5034,4.4151-5.2616,1.6435-1.751,1.1256-.6259L195.4,138.7608l-.1731-.1433q-1.2125,2.805-2.25,5.6677-1.04,2.8648-2.078,5.6381l-.1731-.1433a83.7316,83.7316,0,0,0-3.7228,10.3363,20.3091,20.3091,0,0,0,.0869,9.6809,15.0687,15.0687,0,0,0,1.9041,4.6069,12.5,12.5,0,0,0,3.7229,3.8618,15.5884,15.5884,0,0,0,5.3675,2.2794,15.2211,15.2211,0,0,0,6.6654-.1071,28.4892,28.4892,0,0,0,7.0125-2.4187,52.3276,52.3276,0,0,0,9.09-5.7187,99.8451,99.8451,0,0,0,10.8215-9.7394c.9055-.9264,1.8269-1.9091,2.7611-2.9385a19.0961,19.0961,0,0,0,1.9984,3.9378,18.112,18.112,0,0,0,4.5014,4.6795,20.6475,20.6475,0,0,0,6.4933,3.1251,20.1849,20.1849,0,0,0,8.3972.46,28.7931,28.7931,0,0,0,13.1586-5.8131A75.1174,75.1174,0,0,0,280.93,154.6949a16.662,16.662,0,0,0,2.0781,3.7107,18.249,18.249,0,0,0,3.2026,3.432,14.77,14.77,0,0,0,4.155,2.4019,11.1153,11.1153,0,0,0,5.2817.5632,24.2055,24.2055,0,0,0,7.3578-1.8719,41.6129,41.6129,0,0,0,8.9173-5.2567,82.7353,82.7353,0,0,0,10.6483-9.7957,167.9535,167.9535,0,0,0,12.7255-15.6937q1.757-2.4367,3.1012-4.5264l-8.1236,20.1068a18.9351,18.9351,0,0,0-.9523,3.3673,6.7029,6.7029,0,0,0,.086,2.8417,4.3168,4.3168,0,0,0,3.8959,3.485,38.028,38.028,0,0,0,7.7048-.1128,26.6807,26.6807,0,0,0,7.878-1.7883q2.8575-1.27,4.7614-5.58l2.078-4.6856,1.5579-3.7307,2.078-4.6866q1.9032-4.3076,3.6357-8.1572,1.7294-3.8441,3.1167-7.5477l.6924-1.3316q2.9429-4.6619,6.32-9.3974t6.2331-8.3447q2.856-3.6071,4.5013-5.5356,1.6435-1.9263,1.1255-.799l-4.3282,11.1327-.1731-.1433q-1.214,2.8051-2.2511,5.6678-1.0386,2.8647-2.078,5.6382v-.1731l-.6924,1.6778a73.94,73.94,0,0,0-3.2026,9.3813,21.3091,21.3091,0,0,0,.0861,9.1609,14.9022,14.9022,0,0,0,1.9049,4.7808,12.1262,12.1262,0,0,0,3.6358,3.7889,14.322,14.322,0,0,0,5.2807,2.1221,16.809,16.809,0,0,0,6.8393-.224,34.519,34.519,0,0,0,7.0987-2.1735,42.1217,42.1217,0,0,0,8.83-5.2417,92.7531,92.7531,0,0,0,10.7345-9.6374c2.2232-2.28,4.5626-4.9444,7.01-7.9674a22.8262,22.8262,0,0,0,3.3774,4.6219,27.6524,27.6524,0,0,0,8.83,6.2729,34.1233,34.1233,0,0,0,10.9076,2.7981,49.7339,49.7339,0,0,0,11.6-.2634,51.2983,51.2983,0,0,0,19.0455-6.8258,77.7921,77.7921,0,0,0,15.4959-12.4474q3.46-3.5837,6.6211-7.4776a22.8655,22.8655,0,0,0,3.5079,4.8689,27.6527,27.6527,0,0,0,8.83,6.2729A34.128,34.128,0,0,0,522.805,124.17a49.7464,49.7464,0,0,0,11.6-.2635A51.2984,51.2984,0,0,0,553.45,117.081a77.7834,77.7834,0,0,0,15.4959-12.4475,119.3725,119.3725,0,0,0,12.8142-15.7959q5.7963-8.5293,10.82-16.8386l.1739-.8954v.6924A7.5584,7.5584,0,0,0,593.4465,66.3962Zm-56.9626,5.7293a37.53,37.53,0,0,1,11.08-10.043,7.1589,7.1589,0,0,1,3.29-1.2582q1.3839-.0642,1.5587.77.69,6.2892-5.5408,13.1592-6.2313,6.8749-17.833,11.2917A47.2928,47.2928,0,0,1,536.4839,72.1255Zm-248.022,41.97a38.9368,38.9368,0,0,1-1.4717,5.3608q-1.0386,3.036-2.4241,6.3909a.8757.8757,0,0,1-.0861.361.841.841,0,0,0-.087.3612Q275.734,145.2,268.464,146.45a4.5229,4.5229,0,0,1-3.4628-.356,4.22,4.22,0,0,1-2.078-2.5,12.5025,12.5025,0,0,1-.173-5.5971,33.323,33.323,0,0,1,2.0779-7.37,61.0368,61.0368,0,0,1,3.896-7.9418,37.8029,37.8029,0,0,1,5.2806-7.1415,25.6809,25.6809,0,0,1,6.4923-5.0126,13.6979,13.6979,0,0,1,7.3587-1.6982q.8646.0253.9524,1.4811A16.4148,16.4148,0,0,1,288.4619,114.0957Z" />
				<g>
					<path d="M251.1352,221.117H239.75a1.5116,1.5116,0,0,1-1.513-1.513v-8.6779a1.5116,1.5116,0,0,1,1.513-1.513H275.1a1.5115,1.5115,0,0,1,1.5129,1.513v8.6779a1.5115,1.5115,0,0,1-1.5129,1.513H263.7147v42.5148a1.566,1.566,0,0,1-1.513,1.513h-9.5535a1.566,1.566,0,0,1-1.513-1.513Z" />
					<path d="M283.7806,210.9261a1.566,1.566,0,0,1,1.513-1.513h9.4744a1.512,1.512,0,0,1,1.5129,1.513V230.99h22.77V210.9261a1.5113,1.5113,0,0,1,1.5122-1.513h9.4744a1.566,1.566,0,0,1,1.5129,1.513v52.7057a1.566,1.566,0,0,1-1.5129,1.513h-9.4744a1.5113,1.5113,0,0,1-1.5122-1.513V242.6935h-22.77v20.9383a1.512,1.512,0,0,1-1.5129,1.513h-9.4744a1.566,1.566,0,0,1-1.513-1.513Z" />
					<path d="M343.976,210.9261a1.512,1.512,0,0,1,1.5129-1.513H378.45a1.5121,1.5121,0,0,1,1.513,1.513v8.6779a1.5121,1.5121,0,0,1-1.513,1.513H356.3963V230.99h18.1524a1.566,1.566,0,0,1,1.5129,1.513v8.6779a1.5126,1.5126,0,0,1-1.5129,1.513H356.3963v10.7474H378.45a1.5121,1.5121,0,0,1,1.513,1.513v8.6779a1.5121,1.5121,0,0,1-1.513,1.513H345.4889a1.512,1.512,0,0,1-1.5129-1.513Z" />
					<path d="M406.6391,210.9261a1.4971,1.4971,0,0,1,1.433-1.513h19.427a27.866,27.866,0,1,1,0,55.7317h-19.427a1.4971,1.4971,0,0,1-1.433-1.513Zm20.0635,42.4349c8.9962,0,15.5247-7.0851,15.5247-16.1612,0-8.9978-6.5285-16.0828-15.5247-16.0828H419.06v32.244Z" />
					<path d="M462.2956,210.9261a1.5115,1.5115,0,0,1,1.513-1.513h32.96a1.5115,1.5115,0,0,1,1.513,1.513v8.6779a1.5115,1.5115,0,0,1-1.513,1.513H474.716V230.99h18.1523a1.566,1.566,0,0,1,1.5129,1.513v8.6779a1.5126,1.5126,0,0,1-1.5129,1.513H474.716v10.7474h22.053a1.5115,1.5115,0,0,1,1.513,1.513v8.6779a1.5115,1.5115,0,0,1-1.513,1.513h-32.96a1.5115,1.5115,0,0,1-1.513-1.513Z" />
					<path d="M500.9929,211.4826a1.4049,1.4049,0,0,1,1.353-2.07H512.935a1.56,1.56,0,0,1,1.353.8764l13.1369,29.06h.4782L541.04,210.29a1.56,1.56,0,0,1,1.3531-.8764h10.5891a1.4049,1.4049,0,0,1,1.353,2.07l-24.999,53.5822a1.5165,1.5165,0,0,1-1.353.8764h-.7965a1.5165,1.5165,0,0,1-1.353-.8764Z" />
				</g>
			</g>
		</SVG>
	);
});

const LogoLarge = React.forwardRef<
	SVGSVGElement,
	Omit<React.ComponentProps<typeof SVG>, "viewBox">
>(({ title = "Chance the Developer", ...props }, ref) => {
	return (
		<SVG title={title} ref={ref} {...props} viewBox="0 0 593.6767 245.9412">
			<g>
				<path d="M593.4465,66.3962A6.8551,6.8551,0,0,0,590.9353,62.5a6.0257,6.0257,0,0,0-4.3282-1.0734,7.3883,7.3883,0,0,0-4.76,2.896,136.4962,136.4962,0,0,1-8.9165,14,126.4471,126.4471,0,0,1-9.7829,11.8988,69.2852,69.2852,0,0,1-10.3029,9.13,45.0511,45.0511,0,0,1-10.6475,5.7274,21.09,21.09,0,0,1-3.81,1.0015,12.5123,12.5123,0,0,1-4.1543.0222,8.39,8.39,0,0,1-3.6358-1.4526,6.2887,6.2887,0,0,1-2.2511-3.5948l-.52-1.4684a92.8579,92.8579,0,0,0,15.93-5.7706,74.1328,74.1328,0,0,0,14.3712-8.7051A49.5934,49.5934,0,0,0,568.688,74.0317a24.7873,24.7873,0,0,0,4.5-12.8943,15.7874,15.7874,0,0,0-1.817-6.44,14.1974,14.1974,0,0,0-4.8484-5.313,18.7979,18.7979,0,0,0-8.138-2.7553,35.3754,35.3754,0,0,0-11.86.9145,49.4234,49.4234,0,0,0-12.5523,4.8434,78.1817,78.1817,0,0,0-12.12,8.144,85.3676,85.3676,0,0,0-10.6474,10.3156,75.7767,75.7767,0,0,0-4.9392,6.3639,8.23,8.23,0,0,0-1.12.9985q-5.0241,7.2708-9.6968,13.788a132.1769,132.1769,0,0,1-9.5227,11.8532,73.094,73.094,0,0,1-9.869,9.1423,39.6314,39.6314,0,0,1-10.5613,5.7987,20.6278,20.6278,0,0,1-3.55.2644,16.8116,16.8116,0,0,1-3.8959-.4554,8.9779,8.9779,0,0,1-3.4619-1.6547,6.69,6.69,0,0,1-2.2511-3.1625,21.2968,21.2968,0,0,1-.26-10.3435,42.0989,42.0989,0,0,1,3.8959-11.1454,48.0573,48.0573,0,0,1,6.8394-10.0068,32.3466,32.3466,0,0,1,8.7425-7.1307,6.2888,6.2888,0,0,1,3.4636-1.1151q1.3839.11,1.5587.9436a10.2059,10.2059,0,0,1-.26,4.2868,12.9136,12.9136,0,0,1-1.8188,4.2088q-2.5965,4.4308-1.731,7.3963a5.6753,5.6753,0,0,0,3.4637,3.8194,10.8023,10.8023,0,0,0,5.8869.4591,16.072,16.072,0,0,0,6.2314-2.6306,15.027,15.027,0,0,0,5.0223-5.8844q1.3839-2.8357,2.5973-5.9876a17.8637,17.8637,0,0,0,1.2108-6.4413,15.8819,15.8819,0,0,0-1.4708-6.6725,12.2451,12.2451,0,0,0-4.6745-5.256,19.5606,19.5606,0,0,0-8.312-2.6393,37.5965,37.5965,0,0,0-12.2061.9741,49.4277,49.4277,0,0,0-12.5524,4.8434,78.1921,78.1921,0,0,0-12.12,8.1439,85.3763,85.3763,0,0,0-10.6475,10.3157,75.9533,75.9533,0,0,0-4.8544,6.2385,10.3494,10.3494,0,0,0-.8585.8913L421,105.4958a45.8331,45.8331,0,0,1-3.4618,4.6645q-2.2524,2.7241-4.9354,5.5233-2.6861,2.8-5.54,5.2812a31.29,31.29,0,0,1-5.1084,3.736,4.0556,4.0556,0,0,0-1.4709,1.1185c-.29.3961-.55.3275-.7793-.2121a5.181,5.181,0,0,1,.2591-2.2957q.4311-1.632.7794-3.2507l9.869-25.2444q2.2485-5.7522.8654-10.364a11.19,11.19,0,0,0-7.2716-7.58,20.6365,20.6365,0,0,0-11.7739-.572,23.278,23.278,0,0,0-8.57,4.2445,45.7372,45.7372,0,0,0-7.5318,7.3556,11.5387,11.5387,0,0,0-5.0206-6.6681,12.1157,12.1157,0,0,0-8.6573-1.3683,18.4637,18.4637,0,0,0-5.1945,1.76,33.624,33.624,0,0,0-6.4923,4.6656,61.0375,61.0375,0,0,0-6.06,6.3231,75.3784,75.3784,0,0,0-5.3676,7.33,84.2714,84.2714,0,0,0-4.2358,7.3407c-.0591.0581-.1187.1109-.1777.1709l-8.1371,14.2121a36.72,36.72,0,0,1-3.1166,4.258,61.94,61.94,0,0,1-4.6753,5.0463q-2.5963,2.5251-5.3676,4.7323a58.1834,58.1834,0,0,1-5.0206,3.6339,3.1246,3.1246,0,0,1-2.1642-.7532,1.8694,1.8694,0,0,1-.4331-2.2627q1.7292-4.6232,4.5883-12.13,2.8573-7.5032,5.6268-14.3866v.1731a18.19,18.19,0,0,0,1.4718-3.4558q.605-1.9215,1.2986-3.6,1.5579-4.0743,1.0386-6.4118a4.6136,4.6136,0,0,0-4.0681-3.4554,27.7414,27.7414,0,0,0-7.7049.1137,31.9359,31.9359,0,0,0-7.0125,1.6385,9.5849,9.5849,0,0,0-4.9345,4.3986,17.7633,17.7633,0,0,0-7.8779-3.6664,31.8206,31.8206,0,0,0-10.8214-.0426,32.604,32.604,0,0,0-11.6869,4.26,62.8824,62.8824,0,0,0-11.3407,8.4439,74.3615,74.3615,0,0,0-9.869,11.3073,72.5921,72.5921,0,0,0-7.4457,13.0538q-1.1376,2.6065-1.9887,5.19c-.89,1.35-2.0073,2.92-3.3762,4.7362a64.5252,64.5252,0,0,1-4.9346,5.7833,65.5178,65.5178,0,0,1-5.4537,5.0941,19.85,19.85,0,0,1-5.0215,3.2009,1.9835,1.9835,0,0,1-.7793.3072,2.0024,2.0024,0,0,0-.7785.307,3.28,3.28,0,0,1-.6933.2923,5.1881,5.1881,0,0,1,.26-2.2958q.43-1.6317.7794-3.2506l9.8689-25.2445q2.2485-5.752.8655-10.364a11.1581,11.1581,0,0,0-7.3586-7.5646,21.0477,21.0477,0,0,0-11.86-.5572,21.6047,21.6047,0,0,0-9.35,4.8979q5.7134-13.4494,10.4752-24.9165Q212.8856,76.712,215.312,70.58v-.1731a13.3462,13.3462,0,0,0,1.0385-3.6414,5.9616,5.9616,0,0,0-.1731-2.5675,4.6326,4.6326,0,0,0-4.155-3.44,28.2026,28.2026,0,0,0-7.6188.0989,26.7525,26.7525,0,0,0-7.5318,1.9879,10.5567,10.5567,0,0,0-4.9345,5.35q-2.2524,5.0623-5.8869,13.5659-3.6349,8.5054-7.9641,18.8567-4.3295,10.3541-9.09,21.8217-3.5737,8.61-6.9549,16.7976a148.6788,148.6788,0,0,1-16.6772,21.8088,114.2767,114.2767,0,0,1-18.5263,16.1723,83.8111,83.8111,0,0,1-17.8339,9.4738,91.3267,91.3267,0,0,1-16.2752,4.5313q-3.81.6555-7.3586.92-3.5506.2654-6.84.3109A62.41,62.41,0,0,1,61.13,190.4252a41.8766,41.8766,0,0,1-13.5049-6.3343,38.0454,38.0454,0,0,1-9.6958-10.1922,52.9488,52.9488,0,0,1-6.1462-13.227,72.2321,72.2321,0,0,1-2.5972-25.4381,116.8166,116.8166,0,0,1,5.54-28.4818A147.3451,147.3451,0,0,1,47.7118,77.8536,144.9583,144.9583,0,0,1,67.45,51.3439a137.5926,137.5926,0,0,1,25.885-21.507A108.523,108.523,0,0,1,124.5864,16.064,43.4208,43.4208,0,0,1,136.88,14.9018a26.0819,26.0819,0,0,1,9.1767,2.1444,17.4261,17.4261,0,0,1,6.1461,4.57,17.851,17.851,0,0,1,3.3766,6.0854,60.05,60.05,0,0,1-.5193,14.8928A80.9082,80.9082,0,0,1,150.8175,58.82a96.9774,96.9774,0,0,1-7.7048,15.9557A83.53,83.53,0,0,1,132.4644,88.987a63.2793,63.2793,0,0,1-13.2456,10.8488,43.3235,43.3235,0,0,1-15.41,5.8533,20.1816,20.1816,0,0,1-8.31-.3015,6.953,6.953,0,0,1-5.3677-4.9636,15.8958,15.8958,0,0,1,1.2117-11.8092A49.7388,49.7388,0,0,1,99.3078,76.77a79.6635,79.6635,0,0,1,10.9945-10.2023,73.5193,73.5193,0,0,1,10.4752-6.91,6.7132,6.7132,0,0,0,2.77-3.3339,6.192,6.192,0,0,0,0-3.5488,8.4984,8.4984,0,0,0-2.9435-3.8228,4.4329,4.4329,0,0,0-4.5022-.61,57.7342,57.7342,0,0,0-12.12,6.5A107.809,107.809,0,0,0,91.776,64.6473a111.648,111.648,0,0,0-11.0807,11.861A86.5765,86.5765,0,0,0,72.038,89.339a51.4971,51.4971,0,0,0-5.0214,12.6368,20.4624,20.4624,0,0,0,.0869,11.0665,19.2926,19.2926,0,0,0,4.6745,8.0263,23.0758,23.0758,0,0,0,7.0995,4.8389,26.024,26.024,0,0,0,8.4833,2.09,34.8111,34.8111,0,0,0,8.6573-.3636,60.7553,60.7553,0,0,0,20.0841-7.6968,116.7484,116.7484,0,0,0,20.085-14.8817A160.7464,160.7464,0,0,0,154.28,85.4937a146.005,146.005,0,0,0,14.2842-21.8488,98.0983,98.0983,0,0,0,8.57-21.8184,44.099,44.099,0,0,0,.9524-19.3825,28.57,28.57,0,0,0-6.4932-11.0032,32.856,32.856,0,0,0-11.6869-7.8586A52.1006,52.1006,0,0,0,142.94.0946a85.1265,85.1265,0,0,0-22.3352,2.1109A115.2474,115.2474,0,0,0,86.4953,14.7381,158.2441,158.2441,0,0,0,55.33,37.4136,184.88,184.88,0,0,0,29.1856,67.6217a175.6678,175.6678,0,0,0-18.8725,34.845A145.2731,145.2731,0,0,0,.79,139.4255,104.0331,104.0331,0,0,0,2.6943,175.89a63.9374,63.9374,0,0,0,10.9946,21.31,60.5471,60.5471,0,0,0,16.6222,14.5416,66.2754,66.2754,0,0,0,20.43,7.8264,78.7045,78.7045,0,0,0,22.2491,1.3665q1.9031-.156,3.809-.395,1.9031-.2418,3.8088-.5691a102.5939,102.5939,0,0,0,28.0491-9.153A135.6871,135.6871,0,0,0,133.59,195.0157q5.727-4.585,10.8225-9.5632a3.2428,3.2428,0,0,0,.0841.3285,4.3171,4.3171,0,0,0,3.896,3.485,38.0281,38.0281,0,0,0,7.7048-.1128,25.4576,25.4576,0,0,0,7.9641-1.8892q2.9469-1.3755,4.8483-5.5093,2.0772-4.8569,5.3677-12.7832,3.2871-7.9224,7.2717-17.44,2.9416-5.0055,6.4062-9.7583,3.4609-4.751,6.2331-8.2578,2.7678-3.5034,4.4153-5.2616,1.6434-1.751,1.1255-.6259L195.4,138.7608l-.1731-.1433q-1.2125,2.805-2.25,5.6677-1.04,2.8648-2.078,5.6381l-.1731-.1433a83.6984,83.6984,0,0,0-3.7228,10.3363,20.3079,20.3079,0,0,0,.087,9.6809,15.0706,15.0706,0,0,0,1.9039,4.6069,12.503,12.503,0,0,0,3.7229,3.8618,15.5894,15.5894,0,0,0,5.3677,2.2794,15.2211,15.2211,0,0,0,6.6654-.1071,28.4914,28.4914,0,0,0,7.0124-2.4187,52.3355,52.3355,0,0,0,9.09-5.7187,99.8638,99.8638,0,0,0,10.8214-9.7394c.9056-.9263,1.8269-1.9091,2.7611-2.9384a19.0885,19.0885,0,0,0,1.9985,3.9377,18.1082,18.1082,0,0,0,4.5013,4.6795,20.6491,20.6491,0,0,0,6.4932,3.1251,20.1857,20.1857,0,0,0,8.3973.46,28.7923,28.7923,0,0,0,13.1585-5.8131,75.118,75.118,0,0,0,11.947-11.3178,16.6654,16.6654,0,0,0,2.078,3.7107,18.25,18.25,0,0,0,3.2027,3.432,14.77,14.77,0,0,0,4.1551,2.4019,11.1146,11.1146,0,0,0,5.2815.5632,24.2034,24.2034,0,0,0,7.3578-1.8719,41.6085,41.6085,0,0,0,8.9174-5.2567,82.7354,82.7354,0,0,0,10.6484-9.7957,167.9542,167.9542,0,0,0,12.7254-15.6937q1.757-2.4367,3.1012-4.5265l-8.1235,20.1069a18.9287,18.9287,0,0,0-.9525,3.3673,6.7045,6.7045,0,0,0,.0861,2.8417,4.3168,4.3168,0,0,0,3.8959,3.485,38.029,38.029,0,0,0,7.7049-.1128,26.68,26.68,0,0,0,7.8779-1.7883q2.8575-1.27,4.7614-5.58l2.078-4.6856,1.5579-3.7307,2.078-4.6866q1.903-4.3076,3.6358-8.1572,1.7292-3.8441,3.1165-7.5477l.6924-1.3316q2.9431-4.6619,6.32-9.3974t6.2331-8.3447q2.856-3.6071,4.5013-5.5356,1.6434-1.9263,1.1255-.799l-4.3282,11.1327-.1731-.1433q-1.2138,2.8051-2.2511,5.6678-1.0385,2.8647-2.078,5.6382v-.1731l-.6923,1.6778a73.91,73.91,0,0,0-3.2027,9.3813,21.3091,21.3091,0,0,0,.0861,9.1609,14.9022,14.9022,0,0,0,1.9049,4.7808,12.1251,12.1251,0,0,0,3.6358,3.7889,14.3227,14.3227,0,0,0,5.2807,2.1221,16.81,16.81,0,0,0,6.8394-.224,34.52,34.52,0,0,0,7.0986-2.1735,42.1192,42.1192,0,0,0,8.83-5.2417,92.7448,92.7448,0,0,0,10.7344-9.6374c2.2232-2.2794,4.5627-4.9444,7.01-7.9674a22.8262,22.8262,0,0,0,3.3774,4.6219,27.6509,27.6509,0,0,0,8.83,6.2729,34.1234,34.1234,0,0,0,10.9075,2.7981,49.7346,49.7346,0,0,0,11.6-.2634,51.3007,51.3007,0,0,0,19.0456-6.8258,77.7916,77.7916,0,0,0,15.4958-12.4474q3.46-3.5837,6.6211-7.4776a22.8684,22.8684,0,0,0,3.508,4.8689,27.6505,27.6505,0,0,0,8.83,6.2729,34.1267,34.1267,0,0,0,10.9076,2.7982,49.7457,49.7457,0,0,0,11.6-.2635,51.3,51.3,0,0,0,19.0455-6.8258,77.7857,77.7857,0,0,0,15.4958-12.4475,119.38,119.38,0,0,0,12.8142-15.7959q5.7965-8.5293,10.82-16.8386l.174-.8954v.6924A7.5594,7.5594,0,0,0,593.4465,66.3962Zm-56.9627,5.7293a37.5323,37.5323,0,0,1,11.08-10.043,7.159,7.159,0,0,1,3.29-1.2582q1.3839-.0642,1.5587.77.6906,6.2892-5.5407,13.1592-6.2314,6.8749-17.833,11.2917A47.2925,47.2925,0,0,1,536.4838,72.1255Zm-248.0218,41.97a38.9671,38.9671,0,0,1-1.4718,5.3608q-1.0384,3.036-2.4241,6.3909a.8728.8728,0,0,1-.0862.361.8437.8437,0,0,0-.0869.3612Q275.734,145.2,268.464,146.45a4.5229,4.5229,0,0,1-3.4628-.356,4.22,4.22,0,0,1-2.078-2.5,12.5038,12.5038,0,0,1-.1731-5.5971,33.3345,33.3345,0,0,1,2.078-7.37,61.05,61.05,0,0,1,3.896-7.9418,37.8029,37.8029,0,0,1,5.2806-7.1415,25.6827,25.6827,0,0,1,6.4923-5.0126,13.6979,13.6979,0,0,1,7.3587-1.6982q.8646.0253.9525,1.4811A16.42,16.42,0,0,1,288.462,114.0957Z" />
				<g>
					<path d="M186.2957,217.9358h-7.113a.9444.9444,0,0,1-.9453-.9453v-5.4218a.9444.9444,0,0,1,.9453-.9453h22.0855a.9444.9444,0,0,1,.9453.9453v5.4218a.9444.9444,0,0,1-.9453.9453h-7.113v26.5626a.9784.9784,0,0,1-.9453.9452H187.241a.9784.9784,0,0,1-.9453-.9452Z" />
					<path d="M206.692,211.5687a.9785.9785,0,0,1,.9453-.9453h5.9194a.9447.9447,0,0,1,.9453.9453v12.5354h14.2266V211.5687a.9443.9443,0,0,1,.9447-.9453h5.9195a.9785.9785,0,0,1,.9453.9453v32.93a.9784.9784,0,0,1-.9453.9452h-5.9195a.9442.9442,0,0,1-.9447-.9452v-13.082H214.502v13.082a.9446.9446,0,0,1-.9453.9452h-5.9194a.9784.9784,0,0,1-.9453-.9452Z" />
					<path d="M244.3011,211.5687a.9447.9447,0,0,1,.9453-.9453H265.84a.9447.9447,0,0,1,.9453.9453v5.4218a.9447.9447,0,0,1-.9453.9453H252.0611v6.1683h11.3413a.9783.9783,0,0,1,.9452.9452v5.4219a.9449.9449,0,0,1-.9452.9452H252.0611v6.7149H265.84a.9446.9446,0,0,1,.9453.9452v5.4219a.9446.9446,0,0,1-.9453.9452H245.2464a.9446.9446,0,0,1-.9453-.9452Z" />
					<path d="M283.4519,211.5687a.9354.9354,0,0,1,.8954-.9453h12.1376a17.41,17.41,0,1,1,0,34.82H284.3473a.9354.9354,0,0,1-.8954-.9452Zm12.5354,26.5126c5.6207,0,9.7-4.4266,9.7-10.0972,0-5.6217-4.0788-10.0483-9.6995-10.0483H291.212v20.1455Z" />
					<path d="M318.2252,211.5687a.9444.9444,0,0,1,.9452-.9453h20.5932a.9444.9444,0,0,1,.9453.9453v5.4218a.9444.9444,0,0,1-.9453.9453H325.9852v6.1683h11.3413a.9783.9783,0,0,1,.9452.9452v5.4219a.9449.9449,0,0,1-.9452.9452H325.9852v6.7149h13.7784a.9443.9443,0,0,1,.9453.9452v5.4219a.9443.9443,0,0,1-.9453.9452H319.17a.9443.9443,0,0,1-.9452-.9452Z" />
					<path d="M342.4026,211.9164a.8777.8777,0,0,1,.8453-1.293h6.6159a.9749.9749,0,0,1,.8454.5476l8.2076,18.156h.2988l8.2077-18.156a.9747.9747,0,0,1,.8453-.5476h6.616a.8777.8777,0,0,1,.8453,1.293l-15.619,33.4773a.9475.9475,0,0,1-.8453.5475h-.4976a.9476.9476,0,0,1-.8454-.5475Z" />
					<path d="M379.0154,211.5687a.9444.9444,0,0,1,.9452-.9453h20.5932a.9444.9444,0,0,1,.9453.9453v5.4218a.9444.9444,0,0,1-.9453.9453H386.7754v6.1683h11.3413a.9783.9783,0,0,1,.9452.9452v5.4219a.9449.9449,0,0,1-.9452.9452H386.7754v6.7149h13.7784a.9443.9443,0,0,1,.9453.9452v5.4219a.9443.9443,0,0,1-.9453.9452H379.9606a.9443.9443,0,0,1-.9452-.9452Z" />
					<path d="M407.67,211.5687a.9444.9444,0,0,1,.9453-.9453h5.9194a.9785.9785,0,0,1,.9453.9453v26.5626h11.8389a.945.945,0,0,1,.9453.9452v5.4219a.945.945,0,0,1-.9453.9452H408.6156a.9443.9443,0,0,1-.9453-.9452Z" />
					<path d="M447.3178,210.1258A17.9078,17.9078,0,1,1,429.46,228.083,17.8754,17.8754,0,0,1,447.3178,210.1258Zm0,27.8566a9.949,9.949,0,1,0-9.8994-9.8994A9.9671,9.9671,0,0,0,447.3178,237.9824Z" />
					<path d="M469.8534,211.5687a.9444.9444,0,0,1,.9453-.9453h11.9878a11.0931,11.0931,0,1,1,.05,22.186h-5.2229v11.689a.9784.9784,0,0,1-.9453.9452h-5.87a.9443.9443,0,0,1-.9453-.9452Zm12.4854,13.9772a3.9056,3.9056,0,0,0,3.93-3.9289,3.7947,3.7947,0,0,0-3.93-3.6812h-4.7253v7.61Z" />
					<path d="M497.8609,211.5687a.9444.9444,0,0,1,.9453-.9453h20.5931a.9444.9444,0,0,1,.9453.9453v5.4218a.9444.9444,0,0,1-.9453.9453H505.6209v6.1683h11.3413a.9784.9784,0,0,1,.9453.9452v5.4219a.945.945,0,0,1-.9453.9452H505.6209v6.7149h13.7784a.9443.9443,0,0,1,.9453.9452v5.4219a.9443.9443,0,0,1-.9453.9452H498.8062a.9443.9443,0,0,1-.9453-.9452Z" />
					<path d="M526.4159,211.5687a.9444.9444,0,0,1,.9453-.9453h14.8735a10.8171,10.8171,0,0,1,10.8437,10.7448c0,4.5764-3.0347,8.2576-7.3624,9.9983l6.8148,12.6342a.9412.9412,0,0,1-.8454,1.4429H545.07a.9145.9145,0,0,1-.7953-.4476l-6.616-13.1819h-3.4323v12.6843a.9784.9784,0,0,1-.9453.9452h-5.9194a.9443.9443,0,0,1-.9453-.9452Zm15.1713,13.9283a3.99,3.99,0,0,0,3.7811-3.98,3.811,3.811,0,0,0-3.7811-3.78h-7.3613v7.76Z" />
				</g>
			</g>
		</SVG>
	);
});

LogoSmall.displayName = "LogoSmall";
LogoLarge.displayName = "LogoLarge";

export { LogoSmall, LogoLarge };