import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

const sizeCharts = [
  {
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    measurements: {
      "Chest (inches)": [36, 38, 40, 42, 44],
      "Length (inches)": [26, 27, 28, 29, 30],
      "Shoulder (inches)": [16, 17, 18, 19, 20]
    }
  },
  {
    category: "Jackets",
    sizes: ["XS", "S", "M", "L", "XL"],
    measurements: {
      "Chest (inches)": [38, 40, 42, 44, 46],
      "Length (inches)": [28, 29, 30, 31, 32],
      "Sleeve (inches)": [32, 33, 34, 35, 36]
    }
  }
];

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Size Guide"
          title="Find your perfect fit"
          subtitle="Measurements for our handcrafted pieces. All measurements are in inches."
        />
        <div className="mt-10 space-y-8">
          {sizeCharts.map((chart) => (
            <div
              key={chart.category}
              className="overflow-hidden rounded-3xl border border-black/5 bg-white/70"
            >
              <div className="border-b border-black/5 bg-clay/30 p-4">
                <h3 className="font-semibold text-black">{chart.category}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-black/5">
                      <th className="p-4 text-left text-xs uppercase tracking-[0.24em] text-moss">
                        Size
                      </th>
                      {chart.sizes.map((size) => (
                        <th
                          key={size}
                          className="p-4 text-center text-xs uppercase tracking-[0.24em] text-black"
                        >
                          {size}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(chart.measurements).map(([measure, values]) => (
                      <tr key={measure} className="border-b border-black/5">
                        <td className="p-4 text-sm font-medium text-black">{measure}</td>
                        {values.map((value: number, i: number) => (
                          <td key={i} className="p-4 text-center text-sm text-black/70">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-4 font-semibold text-black">Measuring Tips</h3>
            <ul className="space-y-2 text-sm text-black/70">
              <li>• Measure over light clothing, not heavy layers</li>
              <li>• Keep the measuring tape level and snug but not tight</li>
              <li>• For chest, measure around the fullest part</li>
              <li>• For length, measure from the top of the shoulder down</li>
              <li>• If between sizes, we recommend sizing up</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
