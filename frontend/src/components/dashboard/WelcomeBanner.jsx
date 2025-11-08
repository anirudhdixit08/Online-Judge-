import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const WelcomeBanner = () => {
  const { user } = useSelector((state) => state.auth);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : user?.userName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="card bg-base-100 shadow-xl p-6 md:p-8 border border-base-300"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
        className="text-2xl md:text-3xl font-bold leading-tight"
      >
        Welcome back,{" "}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {displayName}
        </span>
        !
      </motion.h1>

      {user?.userName && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm mt-1 text-base-content/60"
        >
          <span className="kbd kbd-sm">@{user.userName}</span>
        </motion.p>
      )}

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 text-base-content/70"
      >
        Ready to tackle a new challenge? Every problem you solve makes you a better programmer.
      </motion.p>
    </motion.div>
  );
};

export default WelcomeBanner;
