import { PieChart, Pie, Cell, Legend } from 'recharts';
import colors from 'plaid-threads/scss/colors';
import PropTypes from 'prop-types';

export default function CategoriesChart(props) {
  const data = [];

CategoriesChart.propTypes = {
    categories: PropTypes.object.isRequired,
};

const labels = Object.keys(props.categories);
const values = Object.values(props.categories);
for (let i = 0; i < labels.length; i++) {
    data.push({ name: labels[i], value: Math.round(values[i]) });
}

  const COLORS = [
    colors.yellow900,
    colors.red900,
    colors.blue900,
    colors.green900,
    colors.black1000,
    colors.purple600,
  ];

  const renderLabel = (value) => {
    return `$${value.value.toLocaleString()}`;
  };

  return (
    <div className="holdingsList">
      <h4 className="holdingsHeading">Spending Categories</h4>
      <PieChart width={400} height={400}>
        <Legend />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          isAnimationActive={false}
          paddingAngle={5}
          label={renderLabel}
          innerRadius={70}
          outerRadius={90}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}